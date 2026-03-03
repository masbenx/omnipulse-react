// ─────────────────────────────────────────────
// @omnipulse/react — Error Tracker
// Automatic global error & unhandledrejection capture
// ─────────────────────────────────────────────

import { Transport } from './transport';
import { ErrorEntry } from './types';

export class ErrorTracker {
    private transport: Transport;
    private serviceName: string;
    private installed = false;
    private originalOnError: OnErrorEventHandler | null = null;
    private boundOnError: (event: ErrorEvent) => void;
    private boundOnRejection: (event: PromiseRejectionEvent) => void;

    constructor(transport: Transport, serviceName?: string) {
        this.transport = transport;
        this.serviceName = serviceName || 'react-app';
        this.boundOnError = this.handleError.bind(this);
        this.boundOnRejection = this.handleRejection.bind(this);
    }

    /**
     * Install global error listeners.
     * Safe to call multiple times — only installs once.
     */
    public install(): void {
        if (this.installed || typeof window === 'undefined') return;

        this.originalOnError = window.onerror;
        window.addEventListener('error', this.boundOnError);
        window.addEventListener('unhandledrejection', this.boundOnRejection);
        this.installed = true;
    }

    /**
     * Remove global error listeners.
     */
    public uninstall(): void {
        if (!this.installed || typeof window === 'undefined') return;

        window.removeEventListener('error', this.boundOnError);
        window.removeEventListener('unhandledrejection', this.boundOnRejection);
        window.onerror = this.originalOnError;
        this.installed = false;
    }

    /**
     * Manually capture an error.
     */
    public captureError(error: Error, meta?: Record<string, any>): void {
        const entry = this.errorToEntry(error, meta);
        this.transport.addError(entry);
    }

    /**
     * Manually capture a message as an error-level log.
     */
    public captureMessage(message: string, meta?: Record<string, any>): void {
        const entry: ErrorEntry = {
            type: 'ManualCapture',
            message,
            timestamp: new Date().toISOString(),
            service: this.serviceName,
            url: typeof window !== 'undefined' ? window.location.href : undefined,
            meta,
        };
        this.transport.addError(entry);
    }

    // ─── Internal Handlers ───────────────────

    private handleError(event: ErrorEvent): void {
        try {
            const entry: ErrorEntry = {
                type: event.error?.name || 'Error',
                message: event.message || 'Unknown error',
                stack: event.error?.stack,
                url: event.filename || window.location.href,
                line: event.lineno,
                column: event.colno,
                timestamp: new Date().toISOString(),
                service: this.serviceName,
            };
            this.transport.addError(entry);
        } catch {
            // Silent — SDK must never crash the host app
        }
    }

    private handleRejection(event: PromiseRejectionEvent): void {
        try {
            const reason = event.reason;
            const entry: ErrorEntry = {
                type: 'UnhandledRejection',
                message: reason?.message || String(reason) || 'Unhandled promise rejection',
                stack: reason?.stack,
                url: typeof window !== 'undefined' ? window.location.href : undefined,
                timestamp: new Date().toISOString(),
                service: this.serviceName,
                meta: {
                    reason_type: typeof reason,
                },
            };
            this.transport.addError(entry);
        } catch {
            // Silent
        }
    }

    private errorToEntry(error: Error, meta?: Record<string, any>): ErrorEntry {
        return {
            type: error.name || 'Error',
            message: error.message || 'Unknown error',
            stack: error.stack,
            url: typeof window !== 'undefined' ? window.location.href : undefined,
            timestamp: new Date().toISOString(),
            service: this.serviceName,
            meta,
        };
    }
}
