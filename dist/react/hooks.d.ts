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
export declare function useOmniPulse(): OmniPulseClient;
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
export declare function useLogger(): Logger;
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
export declare function useErrorCapture(): (error: Error, meta?: Record<string, any>) => void;
//# sourceMappingURL=hooks.d.ts.map