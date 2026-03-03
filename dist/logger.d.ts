import { Transport } from './transport';
export declare class Logger {
    private transport;
    private serviceName;
    constructor(transport: Transport, serviceName?: string);
    private log;
    info(message: string, meta?: Record<string, any>): void;
    warn(message: string, meta?: Record<string, any>): void;
    error(message: string, meta?: Record<string, any>): void;
    debug(message: string, meta?: Record<string, any>): void;
}
