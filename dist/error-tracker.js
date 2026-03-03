"use strict";
// ─────────────────────────────────────────────
// @omnipulse/react — Error Tracker
// Automatic global error & unhandledrejection capture
// ─────────────────────────────────────────────
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorTracker = void 0;
class ErrorTracker {
    constructor(transport, serviceName) {
        this.installed = false;
        this.originalOnError = null;
        this.transport = transport;
        this.serviceName = serviceName || 'react-app';
        this.boundOnError = this.handleError.bind(this);
        this.boundOnRejection = this.handleRejection.bind(this);
    }
    /**
     * Install global error listeners.
     * Safe to call multiple times — only installs once.
     */
    install() {
        if (this.installed || typeof window === 'undefined')
            return;
        this.originalOnError = window.onerror;
        window.addEventListener('error', this.boundOnError);
        window.addEventListener('unhandledrejection', this.boundOnRejection);
        this.installed = true;
    }
    /**
     * Remove global error listeners.
     */
    uninstall() {
        if (!this.installed || typeof window === 'undefined')
            return;
        window.removeEventListener('error', this.boundOnError);
        window.removeEventListener('unhandledrejection', this.boundOnRejection);
        window.onerror = this.originalOnError;
        this.installed = false;
    }
    /**
     * Manually capture an error.
     */
    captureError(error, meta) {
        const entry = this.errorToEntry(error, meta);
        this.transport.addError(entry);
    }
    /**
     * Manually capture a message as an error-level log.
     */
    captureMessage(message, meta) {
        const entry = {
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
    handleError(event) {
        try {
            const entry = {
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
        }
        catch {
            // Silent — SDK must never crash the host app
        }
    }
    handleRejection(event) {
        try {
            const reason = event.reason;
            const entry = {
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
        }
        catch {
            // Silent
        }
    }
    errorToEntry(error, meta) {
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
exports.ErrorTracker = ErrorTracker;
//# sourceMappingURL=error-tracker.js.map