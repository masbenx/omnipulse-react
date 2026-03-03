"use strict";
// ─────────────────────────────────────────────
// @omnipulse/react — Client (Singleton)
// Main entry point for SDK initialization
// ─────────────────────────────────────────────
Object.defineProperty(exports, "__esModule", { value: true });
exports.OmniPulse = exports.OmniPulseClient = void 0;
const logger_1 = require("./logger");
const error_tracker_1 = require("./error-tracker");
const performance_1 = require("./performance");
const transport_1 = require("./transport");
const SDK_VERSION = '0.1.0';
class OmniPulseClient {
    constructor() {
        // Uninitialized state — provide no-op transport to prevent crashes
        const noopTransport = {
            addLog: () => { },
            addError: () => { },
            addPerformanceMetric: () => { },
        };
        this._logger = new logger_1.Logger(noopTransport);
        this._errorTracker = new error_tracker_1.ErrorTracker(noopTransport);
        this._performance = new performance_1.PerformanceCollector(noopTransport);
    }
    static getInstance() {
        if (!OmniPulseClient.instance) {
            OmniPulseClient.instance = new OmniPulseClient();
        }
        return OmniPulseClient.instance;
    }
    /**
     * Initialize the OmniPulse SDK.
     * Call this once at app startup, typically in main.tsx or via <OmniPulseProvider>.
     */
    init(config) {
        if (this.transport) {
            if (config.debug) {
                console.warn('[OmniPulse] SDK already initialized');
            }
            return;
        }
        this.config = config;
        this.transport = new transport_1.Transport(config);
        const serviceName = config.serviceName || 'react-app';
        this._logger = new logger_1.Logger(this.transport, serviceName);
        this._errorTracker = new error_tracker_1.ErrorTracker(this.transport, serviceName);
        this._performance = new performance_1.PerformanceCollector(this.transport, serviceName);
        // Auto-install error tracking (default: true)
        if (config.enableErrorTracking !== false) {
            this._errorTracker.install();
        }
        // Auto-start performance collection (default: true)
        if (config.enablePerformance !== false) {
            this._performance.start();
        }
        if (config.debug) {
            console.log('[OmniPulse] React SDK initialized', {
                endpoint: config.endpoint || 'https://api.omnipulse.cloud',
                serviceName,
                environment: config.environment || 'production',
                errorTracking: config.enableErrorTracking !== false,
                performance: config.enablePerformance !== false,
            });
        }
    }
    // ─── Public API ──────────────────────────
    /** Access the Logger instance */
    get logger() {
        return this._logger;
    }
    /** Access the ErrorTracker instance */
    get errorTracker() {
        return this._errorTracker;
    }
    /** Access the PerformanceCollector instance */
    get performance() {
        return this._performance;
    }
    /**
     * Manually capture an error and send it to OmniPulse.
     */
    captureError(error, meta) {
        this._errorTracker.captureError(error, meta);
    }
    /**
     * Manually capture a message and send it to OmniPulse.
     */
    captureMessage(message, level = 'info', meta) {
        this._logger[level](message, meta);
    }
    /**
     * Test connection to OmniPulse backend.
     * Sends a test log entry and verifies the connection.
     */
    async test() {
        if (!this.config) {
            return {
                success: false,
                message: 'OmniPulse SDK not initialized. Call OmniPulse.init() first.',
            };
        }
        if (!this.config.apiKey) {
            return {
                success: false,
                message: 'No API key configured. Set "apiKey" in config.',
            };
        }
        if (!this.transport) {
            return {
                success: false,
                message: 'Transport not available.',
            };
        }
        try {
            const result = await this.transport.testConnection();
            return {
                success: result.success,
                message: result.success ? 'Connection successful! Test log sent.' : `Connection failed (HTTP ${result.httpCode})`,
                httpCode: result.httpCode,
                response: result.response,
            };
        }
        catch (err) {
            return {
                success: false,
                message: 'Connection test exception: ' + (err?.message || String(err)),
            };
        }
    }
    /**
     * Get SDK version string.
     */
    version() {
        return `v${SDK_VERSION}`;
    }
    /**
     * Get current configuration (API key redacted).
     */
    getConfig() {
        if (!this.config)
            return {};
        return {
            endpoint: this.config.endpoint ?? 'https://api.omnipulse.cloud',
            serviceName: this.config.serviceName ?? 'react-app',
            apiKey: this.config.apiKey ? '[REDACTED]' : 'not set',
            environment: this.config.environment ?? 'production',
        };
    }
    /**
     * Flush all pending data and stop the SDK.
     */
    shutdown() {
        this._errorTracker.uninstall();
        this._performance.stop();
        this.transport?.stop();
    }
}
exports.OmniPulseClient = OmniPulseClient;
/** Singleton instance of OmniPulseClient */
exports.OmniPulse = OmniPulseClient.getInstance();
//# sourceMappingURL=client.js.map