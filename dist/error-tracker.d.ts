import { Transport } from './transport';
export declare class ErrorTracker {
    private transport;
    private serviceName;
    private installed;
    private originalOnError;
    private boundOnError;
    private boundOnRejection;
    constructor(transport: Transport, serviceName?: string);
    install(): void;
    uninstall(): void;
    captureError(error: Error, meta?: Record<string, any>): void;
    captureMessage(message: string, meta?: Record<string, any>): void;
    private handleError;
    private handleRejection;
    private errorToEntry;
}
