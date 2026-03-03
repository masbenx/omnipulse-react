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
    init(config: OmniPulseConfig): void;
    get logger(): Logger;
    get errorTracker(): ErrorTracker;
    get performance(): PerformanceCollector;
    captureError(error: Error, meta?: Record<string, any>): void;
    captureMessage(message: string, level?: 'info' | 'warn' | 'error', meta?: Record<string, any>): void;
    test(): Promise<TestResult>;
    version(): string;
    getConfig(): Record<string, string>;
    shutdown(): void;
}
export declare const OmniPulse: OmniPulseClient;
