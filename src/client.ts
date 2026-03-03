// ─────────────────────────────────────────────
// @omnipulse/react — Client (Singleton)
// Main entry point for SDK initialization
// ─────────────────────────────────────────────

import { Logger } from './logger';
import { ErrorTracker } from './error-tracker';
import { PerformanceCollector } from './performance';
import { Transport } from './transport';
import { OmniPulseConfig, TestResult } from './types';

const SDK_VERSION = '0.1.0';

export class OmniPulseClient {
    private static instance: OmniPulseClient;
    private transport?: Transport;
    private config?: OmniPulseConfig;
    private _logger: Logger;
    private _errorTracker: ErrorTracker;
    private _performance: PerformanceCollector;

    private constructor() {
        // Uninitialized state — provide no-op transport to prevent crashes
        const noopTransport = {
            addLog: () => { },
            addError: () => { },
            addPerformanceMetric: () => { },
        } as unknown as Transport;

        this._logger = new Logger(noopTransport);
        this._errorTracker = new ErrorTracker(noopTransport);
        this._performance = new PerformanceCollector(noopTransport);
    }

    public static getInstance(): OmniPulseClient {
        if (!OmniPulseClient.instance) {
            OmniPulseClient.instance = new OmniPulseClient();
        }
        return OmniPulseClient.instance;
    }

    /**
     * Initialize the OmniPulse SDK.
     * Call this once at app startup, typically in main.tsx or via <OmniPulseProvider>.
     */
    public init(config: OmniPulseConfig): void {
        if (this.transport) {
            if (config.debug) {
                console.warn('[OmniPulse] SDK already initialized');
            }
            return;
        }

        this.config = config;
        this.transport = new Transport(config);

        const serviceName = config.serviceName || 'react-app';
        this._logger = new Logger(this.transport, serviceName);
        this._errorTracker = new ErrorTracker(this.transport, serviceName);
        this._performance = new PerformanceCollector(this.transport, serviceName);

        // Auto-install error tracking (default: true)
        if (config.enableErrorTracking !== false) {
            this._errorTracker.install();
        }

        // Auto-start performance collection (default: true)
        if (config.enablePerformance !== false) {
            this._performance.start();
        }

        if (config.debug) {
            console.log('[OmniPulse] React SDK initialized', {
                endpoint: config.endpoint || 'https://api.omnipulse.cloud',
                serviceName,
                environment: config.environment || 'production',
                errorTracking: config.enableErrorTracking !== false,
                performance: config.enablePerformance !== false,
            });
        }
    }

    // ─── Public API ──────────────────────────

    /** Access the Logger instance */
    public get logger(): Logger {
        return this._logger;
    }

    /** Access the ErrorTracker instance */
    public get errorTracker(): ErrorTracker {
        return this._errorTracker;
    }

    /** Access the PerformanceCollector instance */
    public get performance(): PerformanceCollector {
        return this._performance;
    }

    /**
     * Manually capture an error and send it to OmniPulse.
     */
    public captureError(error: Error, meta?: Record<string, any>): void {
        this._errorTracker.captureError(error, meta);
    }

    /**
     * Manually capture a message and send it to OmniPulse.
     */
    public captureMessage(message: string, level: 'info' | 'warn' | 'error' = 'info', meta?: Record<string, any>): void {
        this._logger[level](message, meta);
    }

    /**
     * Test connection to OmniPulse backend.
     * Sends a test log entry and verifies the connection.
     */
    public async test(): Promise<TestResult> {
        if (!this.config) {
            return {
                success: false,
                message: 'OmniPulse SDK not initialized. Call OmniPulse.init() first.',
            };
        }

        if (!this.config.apiKey) {
            return {
                success: false,
                message: 'No API key configured. Set "apiKey" in config.',
            };
        }

        if (!this.transport) {
            return {
                success: false,
                message: 'Transport not available.',
            };
        }

        try {
            const result = await this.transport.testConnection();
            return {
                success: result.success,
                message: result.success ? 'Connection successful! Test log sent.' : `Connection failed (HTTP ${result.httpCode})`,
                httpCode: result.httpCode,
                response: result.response,
            };
        } catch (err: any) {
            return {
                success: false,
                message: 'Connection test exception: ' + (err?.message || String(err)),
            };
        }
    }

    /**
     * Get SDK version string.
     */
    public version(): string {
        return `v${SDK_VERSION}`;
    }

    /**
     * Get current configuration (API key redacted).
     */
    public getConfig(): Record<string, string> {
        if (!this.config) return {};

        return {
            endpoint: this.config.endpoint ?? 'https://api.omnipulse.cloud',
            serviceName: this.config.serviceName ?? 'react-app',
            apiKey: this.config.apiKey ? '[REDACTED]' : 'not set',
            environment: this.config.environment ?? 'production',
        };
    }

    /**
     * Flush all pending data and stop the SDK.
     */
    public shutdown(): void {
        this._errorTracker.uninstall();
        this._performance.stop();
        this.transport?.stop();
    }
}

/** Singleton instance of OmniPulseClient */
export const OmniPulse = OmniPulseClient.getInstance();
