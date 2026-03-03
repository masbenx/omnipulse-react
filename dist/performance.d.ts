import { Transport } from './transport';
export declare class PerformanceCollector {
    private transport;
    private serviceName;
    private observers;
    constructor(transport: Transport, serviceName?: string);
    start(): void;
    stop(): void;
    private observeLCP;
    private observeFID;
    private observeCLS;
    private observeFCP;
    private collectNavigationTiming;
    private report;
    private rateMetric;
}
