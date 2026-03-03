export interface OmniPulseConfig {
    apiKey: string;
    serviceName?: string;
    environment?: string;
    endpoint?: string;
    debug?: boolean;
    enableErrorTracking?: boolean;
    enablePerformance?: boolean;
    flushIntervalMs?: number;
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
    url?: string;
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
