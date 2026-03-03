// ─────────────────────────────────────────────
// @omnipulse/react — Logger
// Structured logging to OmniPulse backend
// ─────────────────────────────────────────────

import { Transport } from './transport';
import { LogEntry } from './types';

export class Logger {
    private transport: Transport;
    private serviceName: string;

    constructor(transport: Transport, serviceName?: string) {
        this.transport = transport;
        this.serviceName = serviceName || 'react-app';
    }

    private log(level: LogEntry['level'], message: string, meta?: Record<string, any>): void {
        const entry: LogEntry = {
            level,
            message,
            timestamp: new Date().toISOString(),
            service: this.serviceName,
            host: typeof window !== 'undefined' ? window.location.hostname : undefined,
            meta,
        };

        this.transport.addLog(entry);
    }

    public info(message: string, meta?: Record<string, any>): void {
        this.log('info', message, meta);
    }

    public warn(message: string, meta?: Record<string, any>): void {
        this.log('warn', message, meta);
    }

    public error(message: string, meta?: Record<string, any>): void {
        this.log('error', message, meta);
    }

    public debug(message: string, meta?: Record<string, any>): void {
        this.log('debug', message, meta);
    }
}
