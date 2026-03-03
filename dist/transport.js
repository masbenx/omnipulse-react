"use strict";
// ─────────────────────────────────────────────
// @omnipulse/react — Browser Transport
// Fetch-based batching with sendBeacon fallback
// ─────────────────────────────────────────────
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transport = void 0;
const SDK_VERSION = '0.1.1';
const USER_AGENT = `omnipulse-react-sdk/v${SDK_VERSION}`;
class Transport {
    constructor(config) {
        this.logQueue = [];
        this.errorQueue = [];
        this.perfQueue = [];
        this.flushTimer = null;
        this.config = config;
        this.batchSize = config.batchSize ?? 50;
        this.flushMs = config.flushIntervalMs ?? 5000;
        this.startBatching();
        this.registerUnloadFlush();
    }
    // ─── Queue API ───────────────────────────
    addLog(entry) {
        this.logQueue.push(entry);
        if (this.logQueue.length >= this.batchSize) {
            this.flushLogs();
        }
    }
    addError(entry) {
        this.errorQueue.push(entry);
        if (this.errorQueue.length >= this.batchSize) {
            this.flushErrors();
        }
    }
    addPerformanceMetric(entry) {
        this.perfQueue.push(entry);
        if (this.perfQueue.length >= this.batchSize) {
            this.flushPerformance();
        }
    }
    // ─── Flush Methods ───────────────────────
    flushLogs() {
        if (this.logQueue.length === 0)
            return;
        const batch = this.logQueue.splice(0);
        this.send('/api/ingest/app-logs', {
            entries: batch,
        });
    }
    flushErrors() {
        if (this.errorQueue.length === 0)
            return;
        const batch = this.errorQueue.splice(0);
        for (const error of batch) {
            this.send('/api/ingest/app-errors', error);
        }
    }
    flushPerformance() {
        if (this.perfQueue.length === 0)
            return;
        const batch = this.perfQueue.splice(0);
        this.send('/api/ingest/app-metrics', {
            metrics: batch,
        });
    }
    flushAll() {
        this.flushLogs();
        this.flushErrors();
        this.flushPerformance();
    }
    // ─── Test Connection ─────────────────────
    async testConnection() {
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
        }
        catch {
            return { success: false };
        }
    }
    // ─── Internal ────────────────────────────
    startBatching() {
        if (this.flushTimer)
            clearInterval(this.flushTimer);
        this.flushTimer = setInterval(() => {
            this.flushAll();
        }, this.flushMs);
    }
    /**
     * Use navigator.sendBeacon on page unload to ensure data is delivered
     * even when the page is being closed/navigated away.
     */
    registerUnloadFlush() {
        if (typeof document === 'undefined')
            return; // SSR guard
        const onUnload = () => {
            this.beaconFlush('/api/ingest/app-logs', this.logQueue, 'entries');
            this.beaconFlushErrors('/api/ingest/app-errors', this.errorQueue);
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
    beaconFlush(path, queue, wrapperKey) {
        if (queue.length === 0)
            return;
        const batch = queue.splice(0);
        const endpoint = this.config.endpoint || 'https://api.omnipulse.cloud';
        const url = `${endpoint}${path}`;
        const payload = JSON.stringify({
            [wrapperKey]: batch,
        });
        this.sendBeaconPayload(url, payload);
    }
    beaconFlushErrors(path, queue) {
        if (queue.length === 0)
            return;
        const batch = queue.splice(0);
        const endpoint = this.config.endpoint || 'https://api.omnipulse.cloud';
        const url = `${endpoint}${path}`;
        for (const error of batch) {
            const payload = JSON.stringify(error);
            this.sendBeaconPayload(url, payload);
        }
    }
    sendBeaconPayload(url, payload) {
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
        }
        catch {
            // If fetch with keepalive fails, try sendBeacon as last resort
            try {
                const blob = new Blob([payload], { type: 'application/json' });
                navigator.sendBeacon(url, blob);
            }
            catch {
                // Silent fail
            }
        }
    }
    send(path, payload) {
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
        }
        catch (err) {
            if (this.config.debug) {
                console.error('[OmniPulse] Transport send exception:', err);
            }
        }
    }
    stop() {
        if (this.flushTimer) {
            clearInterval(this.flushTimer);
            this.flushTimer = null;
        }
        this.flushAll();
    }
}
exports.Transport = Transport;
//# sourceMappingURL=transport.js.map