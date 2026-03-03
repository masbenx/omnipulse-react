"use strict";
// ─────────────────────────────────────────────
// @omnipulse/react — React Hooks
// Convenient hooks for OmniPulse SDK features
// ─────────────────────────────────────────────
Object.defineProperty(exports, "__esModule", { value: true });
exports.useOmniPulse = useOmniPulse;
exports.useLogger = useLogger;
exports.useErrorCapture = useErrorCapture;
const react_1 = require("react");
const provider_1 = require("./provider");
/**
 * Access the OmniPulse client instance from React context.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const omnipulse = useOmniPulse();
 *   omnipulse.captureMessage('Page viewed', 'info', { page: '/home' });
 * }
 * ```
 */
function useOmniPulse() {
    return (0, provider_1.useOmniPulseContext)();
}
/**
 * Access the Logger instance for structured logging.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const logger = useLogger();
 *
 *   const handleClick = () => {
 *     logger.info('Button clicked', { buttonId: 'submit' });
 *   };
 *
 *   return <button onClick={handleClick}>Submit</button>;
 * }
 * ```
 */
function useLogger() {
    const client = (0, provider_1.useOmniPulseContext)();
    return client.logger;
}
/**
 * Get a memoized error capture function for components.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const captureError = useErrorCapture();
 *
 *   const handleSubmit = async () => {
 *     try {
 *       await api.submit();
 *     } catch (err) {
 *       captureError(err as Error, { action: 'submit' });
 *     }
 *   };
 * }
 * ```
 */
function useErrorCapture() {
    const client = (0, provider_1.useOmniPulseContext)();
    return (0, react_1.useCallback)((error, meta) => {
        client.captureError(error, meta);
    }, [client]);
}
//# sourceMappingURL=hooks.js.map