import React, { Component, ErrorInfo } from 'react';
export interface OmniPulseErrorBoundaryProps {
    fallback?: React.ReactNode | ((error: Error, reset: () => void) => React.ReactNode);
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
    meta?: Record<string, any>;
    children: React.ReactNode;
}
interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}
export declare class OmniPulseErrorBoundary extends Component<OmniPulseErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: OmniPulseErrorBoundaryProps);
    static getDerivedStateFromError(error: Error): ErrorBoundaryState;
    componentDidCatch(error: Error, errorInfo: ErrorInfo): void;
    private handleReset;
    render(): React.ReactNode;
}
export {};
