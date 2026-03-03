// ─────────────────────────────────────────────
// @omnipulse/react — React Hooks
// Convenient hooks for OmniPulse SDK features
// ─────────────────────────────────────────────

import { useCallback } from 'react';
import { useOmniPulseContext } from './provider';
import { Logger } from '../logger';
import { OmniPulseClient } from '../client';

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
export function useOmniPulse(): OmniPulseClient {
    return useOmniPulseContext();
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
export function useLogger(): Logger {
    const client = useOmniPulseContext();
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
export function useErrorCapture(): (error: Error, meta?: Record<string, any>) => void {
    const client = useOmniPulseContext();

    return useCallback(
        (error: Error, meta?: Record<string, any>) => {
            client.captureError(error, meta);
        },
        [client],
    );
}
