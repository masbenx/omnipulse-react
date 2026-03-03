"use strict";
// ─────────────────────────────────────────────
// @omnipulse/react — Public API
// ─────────────────────────────────────────────
Object.defineProperty(exports, "__esModule", { value: true });
exports.useErrorCapture = exports.useLogger = exports.useOmniPulse = exports.OmniPulseErrorBoundary = exports.OmniPulseProvider = exports.Transport = exports.PerformanceCollector = exports.ErrorTracker = exports.Logger = exports.OmniPulseClient = exports.OmniPulse = void 0;
// Core
var client_1 = require("./client");
Object.defineProperty(exports, "OmniPulse", { enumerable: true, get: function () { return client_1.OmniPulse; } });
Object.defineProperty(exports, "OmniPulseClient", { enumerable: true, get: function () { return client_1.OmniPulseClient; } });
// Modules
var logger_1 = require("./logger");
Object.defineProperty(exports, "Logger", { enumerable: true, get: function () { return logger_1.Logger; } });
var error_tracker_1 = require("./error-tracker");
Object.defineProperty(exports, "ErrorTracker", { enumerable: true, get: function () { return error_tracker_1.ErrorTracker; } });
var performance_1 = require("./performance");
Object.defineProperty(exports, "PerformanceCollector", { enumerable: true, get: function () { return performance_1.PerformanceCollector; } });
var transport_1 = require("./transport");
Object.defineProperty(exports, "Transport", { enumerable: true, get: function () { return transport_1.Transport; } });
// React Integration
var provider_1 = require("./react/provider");
Object.defineProperty(exports, "OmniPulseProvider", { enumerable: true, get: function () { return provider_1.OmniPulseProvider; } });
var error_boundary_1 = require("./react/error-boundary");
Object.defineProperty(exports, "OmniPulseErrorBoundary", { enumerable: true, get: function () { return error_boundary_1.OmniPulseErrorBoundary; } });
var hooks_1 = require("./react/hooks");
Object.defineProperty(exports, "useOmniPulse", { enumerable: true, get: function () { return hooks_1.useOmniPulse; } });
Object.defineProperty(exports, "useLogger", { enumerable: true, get: function () { return hooks_1.useLogger; } });
Object.defineProperty(exports, "useErrorCapture", { enumerable: true, get: function () { return hooks_1.useErrorCapture; } });
