import { Logger } from './logger';
import { ErrorTracker } from './error-tracker';
import { PerformanceCollector } from './performance';
import { OmniPulseConfig, TestResult } from './types';
export declare class OmniPulseClient {
    private static instance;
    private transport?;
    private config?;
    private _logger;
    private _errorTracker;
    private _performance;
    private constructor();
    static getInstance(): OmniPulseClient;
    /**
     * Initialize the OmniPulse SDK.
     * Call this once at app startup, typically in main.tsx or via <OmniPulseProvider>.
     */
    init(config: OmniPulseConfig): void;
    /** Access the Logger instance */
    get logger(): Logger;
    /** Access the ErrorTracker instance */
    get errorTracker(): ErrorTracker;
    /** Access the PerformanceCollector instance */
    get performance(): PerformanceCollector;
    /**
     * Manually capture an error and send it to OmniPulse.
     */
    captureError(error: Error, meta?: Record<string, any>): void;
    /**
     * Manually capture a message and send it to OmniPulse.
     */
    captureMessage(message: string, level?: 'info' | 'warn' | 'error', meta?: Record<string, any>): void;
    /**
     * Test connection to OmniPulse backend.
     * Sends a test log entry and verifies the connection.
     */
    test(): Promise<TestResult>;
    /**
     * Get SDK version string.
     */
    version(): string;
    /**
     * Get current configuration (API key redacted).
     */
    getConfig(): Record<string, string>;
    /**
     * Flush all pending data and stop the SDK.
     */
    shutdown(): void;
}
/** Singleton instance of OmniPulseClient */
export declare const OmniPulse: OmniPulseClient;
//# sourceMappingURL=client.d.ts.map