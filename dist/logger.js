"use strict";
// ─────────────────────────────────────────────
// @omnipulse/react — Logger
// Structured logging to OmniPulse backend
// ─────────────────────────────────────────────
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
class Logger {
    constructor(transport, serviceName) {
        this.transport = transport;
        this.serviceName = serviceName || 'react-app';
    }
    log(level, message, meta) {
        const entry = {
            level,
            message,
            timestamp: new Date().toISOString(),
            service: this.serviceName,
            host: typeof window !== 'undefined' ? window.location.hostname : undefined,
            meta,
        };
        this.transport.addLog(entry);
    }
    info(message, meta) {
        this.log('info', message, meta);
    }
    warn(message, meta) {
        this.log('warn', message, meta);
    }
    error(message, meta) {
        this.log('error', message, meta);
    }
    debug(message, meta) {
        this.log('debug', message, meta);
    }
}
exports.Logger = Logger;
//# sourceMappingURL=logger.js.map