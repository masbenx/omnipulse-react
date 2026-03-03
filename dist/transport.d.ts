import { OmniPulseConfig, LogEntry, ErrorEntry, PerformanceMetric } from './types';
export declare class Transport {
    private config;
    private logQueue;
    private errorQueue;
    private perfQueue;
    private flushTimer;
    private readonly batchSize;
    private readonly flushMs;
    constructor(config: OmniPulseConfig);
    addLog(entry: LogEntry): void;
    addError(entry: ErrorEntry): void;
    addPerformanceMetric(entry: PerformanceMetric): void;
    flushLogs(): void;
    flushErrors(): void;
    flushPerformance(): void;
    flushAll(): void;
    testConnection(): Promise<{
        success: boolean;
        httpCode?: number;
        response?: any;
    }>;
    private startBatching;
    /**
     * Use navigator.sendBeacon on page unload to ensure data is delivered
     * even when the page is being closed/navigated away.
     */
    private registerUnloadFlush;
    private beaconFlush;
    private beaconFlushErrors;
    private sendBeaconPayload;
    private send;
    stop(): void;
}
//# sourceMappingURL=transport.d.ts.map