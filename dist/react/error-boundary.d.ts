import React, { Component, ErrorInfo } from 'react';
export interface OmniPulseErrorBoundaryProps {
    /**
     * Custom fallback UI to show when an error is caught.
     * If a function, receives the error and reset function.
     */
    fallback?: React.ReactNode | ((error: Error, reset: () => void) => React.ReactNode);
    /**
     * Callback when an error is caught (in addition to sending to OmniPulse).
     */
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
    /**
     * Additional metadata to attach to captured errors.
     */
    meta?: Record<string, any>;
    /**
     * Children components to wrap.
     */
    children: React.ReactNode;
}
interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}
/**
 * OmniPulseErrorBoundary — React Error Boundary that automatically
 * captures errors and sends them to OmniPulse.
 *
 * @example
 * ```tsx
 * import { OmniPulseErrorBoundary } from '@omnipulse/react';
 *
 * function App() {
 *   return (
 *     <OmniPulseErrorBoundary
 *       fallback={(error, reset) => (
 *         <div>
 *           <h2>Something went wrong</h2>
 *           <p>{error.message}</p>
 *           <button onClick={reset}>Try Again</button>
 *         </div>
 *       )}
 *     >
 *       <YourApp />
 *     </OmniPulseErrorBoundary>
 *   );
 * }
 * ```
 */
export declare class OmniPulseErrorBoundary extends Component<OmniPulseErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: OmniPulseErrorBoundaryProps);
    static getDerivedStateFromError(error: Error): ErrorBoundaryState;
    componentDidCatch(error: Error, errorInfo: ErrorInfo): void;
    private handleReset;
    render(): React.ReactNode;
}
export {};
//# sourceMappingURL=error-boundary.d.ts.map