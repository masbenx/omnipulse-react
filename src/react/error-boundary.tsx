// ─────────────────────────────────────────────
// @omnipulse/react — Error Boundary Component
// Automatic React error capture to OmniPulse
// ─────────────────────────────────────────────

import React, { Component, ErrorInfo } from 'react';
import { OmniPulse } from '../client';

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
export class OmniPulseErrorBoundary extends Component<OmniPulseErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: OmniPulseErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        // Send to OmniPulse
        try {
            OmniPulse.captureError(error, {
                ...this.props.meta,
                componentStack: errorInfo.componentStack,
                source: 'react-error-boundary',
            });
        } catch {
            // Silent — SDK must never crash
        }

        // Call user's onError callback
        if (this.props.onError) {
            try {
                this.props.onError(error, errorInfo);
            } catch {
                // Silent
            }
        }
    }

    private handleReset = (): void => {
        this.setState({ hasError: false, error: null });
    };

    render(): React.ReactNode {
        if (this.state.hasError && this.state.error) {
            const { fallback } = this.props;

            if (typeof fallback === 'function') {
                return fallback(this.state.error, this.handleReset);
            }

            if (fallback) {
                return fallback;
            }

            // Default fallback
            return React.createElement('div', {
                style: {
                    padding: '2rem',
                    textAlign: 'center' as const,
                    fontFamily: 'system-ui, sans-serif',
                },
            },
                React.createElement('h2', {
                    style: { color: '#dc2626', marginBottom: '0.5rem' }
                }, 'Something went wrong'),
                React.createElement('p', {
                    style: { color: '#6b7280', marginBottom: '1rem' }
                }, this.state.error.message),
                React.createElement('button', {
                    onClick: this.handleReset,
                    style: {
                        padding: '0.5rem 1rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.375rem',
                        background: '#fff',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                    }
                }, 'Try Again'),
            );
        }

        return this.props.children;
    }
}
