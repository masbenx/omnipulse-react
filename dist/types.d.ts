export interface OmniPulseConfig {
    /**
     * The Ingest Key for the project/app.
     * Required for authentication.
     */
    apiKey: string;
    /**
     * The Service Name to identify this application.
     * Defaults to "react-app".
     */
    serviceName?: string;
    /**
     * The environment (e.g., 'production', 'staging').
     * Defaults to 'production'.
     */
    environment?: string;
    /**
     * The endpoint URL of the OmniPulse backend.
     * Defaults to "https://api.omnipulse.cloud".
     */
    endpoint?: string;
    /**
     * Enable console debugging of the SDK itself.
     */
    debug?: boolean;
    /**
     * Enable automatic error tracking (window.onerror, unhandledrejection).
     * Defaults to true.
     */
    enableErrorTracking?: boolean;
    /**
     * Enable automatic Web Vitals collection (LCP, FID, CLS, TTFB).
     * Defaults to true.
     */
    enablePerformance?: boolean;
    /**
     * Flush interval in milliseconds for batched data.
     * Defaults to 5000 (5 seconds).
     */
    flushIntervalMs?: number;
    /**
     * Maximum batch size before auto-flush.
     * Defaults to 50.
     */
    batchSize?: number;
}
export interface LogEntry {
    level: 'info' | 'warn' | 'error' | 'debug';
    message: string;
    timestamp: string;
    service?: string;
    host?: string;
    meta?: Record<string, any>;
    trace_id?: string;
    request_id?: string;
}
export interface ErrorEntry {
    type: string;
    message: string;
    stack?: string;
    route?: string;
    line?: number;
    column?: number;
    timestamp: string;
    service?: string;
    meta?: Record<string, any>;
}
export interface PerformanceMetric {
    name: string;
    value: number;
    rating?: 'good' | 'needs-improvement' | 'poor';
    timestamp: string;
    url?: string;
    meta?: Record<string, any>;
}
export interface TestResult {
    success: boolean;
    message: string;
    httpCode?: number;
    response?: any;
}
//# sourceMappingURL=types.d.ts.map