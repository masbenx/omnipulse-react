import { Transport } from './transport';
export declare class ErrorTracker {
    private transport;
    private serviceName;
    private installed;
    private originalOnError;
    private boundOnError;
    private boundOnRejection;
    constructor(transport: Transport, serviceName?: string);
    /**
     * Install global error listeners.
     * Safe to call multiple times — only installs once.
     */
    install(): void;
    /**
     * Remove global error listeners.
     */
    uninstall(): void;
    /**
     * Manually capture an error.
     */
    captureError(error: Error, meta?: Record<string, any>): void;
    /**
     * Manually capture a message as an error-level log.
     */
    captureMessage(message: string, meta?: Record<string, any>): void;
    private handleError;
    private handleRejection;
    private errorToEntry;
}
//# sourceMappingURL=error-tracker.d.ts.map