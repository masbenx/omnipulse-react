// ─────────────────────────────────────────────
// @omnipulse/react — Public API
// ─────────────────────────────────────────────

// Core
export { OmniPulse, OmniPulseClient } from './client';
export type { TestResult } from './types';

// Modules
export { Logger } from './logger';
export { ErrorTracker } from './error-tracker';
export { PerformanceCollector } from './performance';
export { Transport } from './transport';

// Types
export type {
    OmniPulseConfig,
    LogEntry,
    ErrorEntry,
    PerformanceMetric,
} from './types';

// React Integration
export { OmniPulseProvider } from './react/provider';
export type { OmniPulseProviderProps } from './react/provider';
export { OmniPulseErrorBoundary } from './react/error-boundary';
export type { OmniPulseErrorBoundaryProps } from './react/error-boundary';
export { useOmniPulse, useLogger, useErrorCapture } from './react/hooks';
