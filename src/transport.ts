// ─────────────────────────────────────────────
// @omnipulse/react — Browser Transport
// Fetch-based batching with sendBeacon fallback
// ─────────────────────────────────────────────

import { OmniPulseConfig, LogEntry, ErrorEntry, PerformanceMetric } from './types';

const SDK_VERSION = '0.1.0';
const USER_AGENT = `omnipulse-react-sdk/v${SDK_VERSION}`;

export class Transport {
    private config: OmniPulseConfig;
    private logQueue: LogEntry[] = [];
    private errorQueue: ErrorEntry[] = [];
    private perfQueue: PerformanceMetric[] = [];
    private flushTimer: ReturnType<typeof setInterval> | null = null;
    private readonly batchSize: number;
    private readonly flushMs: number;

    constructor(config: OmniPulseConfig) {
        this.config = config;
        this.batchSize = config.batchSize ?? 50;
        this.flushMs = config.flushIntervalMs ?? 5000;
        this.startBatching();
        this.registerUnloadFlush();
    }

    // ─── Queue API ───────────────────────────

    public addLog(entry: LogEntry): void {
        this.logQueue.push(entry);
        if (this.logQueue.length >= this.batchSize) {
            this.flushLogs();
        }
    }

    public addError(entry: ErrorEntry): void {
        this.errorQueue.push(entry);
        if (this.errorQueue.length >= this.batchSize) {
            this.flushErrors();
        }
    }

    public addPerformanceMetric(entry: PerformanceMetric): void {
        this.perfQueue.push(entry);
        if (this.perfQueue.length >= this.batchSize) {
            this.flushPerformance();
        }
    }

    // ─── Flush Methods ───────────────────────

    public flushLogs(): void {
        if (this.logQueue.length === 0) return;
        const batch = this.logQueue.splice(0);
        this.send('/api/ingest/app-logs', {
            entries: batch,
        });
    }

    public flushErrors(): void {
        if (this.errorQueue.length === 0) return;
        const batch = this.errorQueue.splice(0);
        this.send('/api/ingest/app-errors', {
            entries: batch,
        });
    }

    public flushPerformance(): void {
        if (this.perfQueue.length === 0) return;
        const batch = this.perfQueue.splice(0);
        this.send('/api/ingest/app-metrics', {
            metrics: batch,
        });
    }

    public flushAll(): void {
        this.flushLogs();
        this.flushErrors();
        this.flushPerformance();
    }

    // ─── Test Connection ─────────────────────

    public async testConnection(): Promise<{ success: boolean; httpCode?: number; response?: any }> {
        const endpoint = this.config.endpoint || 'https://api.omnipulse.cloud';
        const url = `${endpoint}/api/ingest/app-logs`;

        const payload = JSON.stringify({
            entries: [{
                level: 'info',
                message: 'OmniPulse React SDK test connection successful',
                timestamp: new Date().toISOString(),
                service: this.config.serviceName || 'react-app',
                meta: {
                    sdk: 'react',
                    test: 'true',
                    user_agent: navigator.userAgent,
                },
            }],
        });

        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Ingest-Key': this.config.apiKey,
                    'X-SDK-Agent': USER_AGENT,
                },
                body: payload,
            });

            const data = await res.json().catch(() => null);
            return {
                success: res.ok,
                httpCode: res.status,
                response: data,
            };
        } catch {
            return { success: false };
        }
    }

    // ─── Internal ────────────────────────────

    private startBatching(): void {
        if (this.flushTimer) clearInterval(this.flushTimer);
        this.flushTimer = setInterval(() => {
            this.flushAll();
        }, this.flushMs);
    }

    /**
     * Use navigator.sendBeacon on page unload to ensure data is delivered
     * even when the page is being closed/navigated away.
     */
    private registerUnloadFlush(): void {
        if (typeof document === 'undefined') return; // SSR guard

        const onUnload = () => {
            this.beaconFlush('/api/ingest/app-logs', this.logQueue, 'entries');
            this.beaconFlush('/api/ingest/app-errors', this.errorQueue, 'entries');
            this.beaconFlush('/api/ingest/app-metrics', this.perfQueue, 'metrics');
        };

        // visibilitychange is the most reliable event for page unload
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                onUnload();
            }
        });

        // Fallback for older browsers
        window.addEventListener('pagehide', onUnload);
    }

    private beaconFlush(path: string, queue: any[], wrapperKey: string): void {
        if (queue.length === 0) return;
        const batch = queue.splice(0);
        const endpoint = this.config.endpoint || 'https://api.omnipulse.cloud';
        const url = `${endpoint}${path}`;

        const payload = JSON.stringify({
            [wrapperKey]: batch,
        });

        // sendBeacon doesn't support custom headers, so we use a Blob with type
        // The backend should accept X-Ingest-Key from query param as fallback
        // For now, we try fetch with keepalive first, fallback to sendBeacon
        try {
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Ingest-Key': this.config.apiKey,
                    'X-SDK-Agent': USER_AGENT,
                },
                body: payload,
                keepalive: true, // Ensures request survives page unload
            }).catch(() => {
                // Silent fail — fire and forget
            });
        } catch {
            // If fetch with keepalive fails, try sendBeacon as last resort
            try {
                const blob = new Blob([payload], { type: 'application/json' });
                navigator.sendBeacon(url, blob);
            } catch {
                // Silent fail
            }
        }
    }

    private send(path: string, payload: Record<string, any>): void {
        const endpoint = this.config.endpoint || 'https://api.omnipulse.cloud';
        const url = `${endpoint}${path}`;
        const body = JSON.stringify(payload);

        try {
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Ingest-Key': this.config.apiKey,
                    'X-SDK-Agent': USER_AGENT,
                },
                body,
            }).catch((err) => {
                if (this.config.debug) {
                    console.error('[OmniPulse] Transport send failed:', err);
                }
            });
        } catch (err) {
            if (this.config.debug) {
                console.error('[OmniPulse] Transport send exception:', err);
            }
        }
    }

    public stop(): void {
        if (this.flushTimer) {
            clearInterval(this.flushTimer);
            this.flushTimer = null;
        }
        this.flushAll();
    }
}
