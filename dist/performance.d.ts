import { Transport } from './transport';
export declare class PerformanceCollector {
    private transport;
    private serviceName;
    private observers;
    constructor(transport: Transport, serviceName?: string);
    /**
     * Start collecting Web Vitals metrics.
     * Safe to call in browser only — no-op in SSR.
     */
    start(): void;
    /**
     * Stop all performance observers.
     */
    stop(): void;
    private observeLCP;
    private observeFID;
    private observeCLS;
    private observeFCP;
    private collectNavigationTiming;
    private report;
    /**
     * Rate a metric based on Google Web Vitals thresholds.
     */
    private rateMetric;
}
//# sourceMappingURL=performance.d.ts.map