"use strict";
// ─────────────────────────────────────────────
// @omnipulse/react — Error Boundary Component
// Automatic React error capture to OmniPulse
// ─────────────────────────────────────────────
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.OmniPulseErrorBoundary = void 0;
const react_1 = __importStar(require("react"));
const client_1 = require("../client");
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
class OmniPulseErrorBoundary extends react_1.Component {
    constructor(props) {
        super(props);
        this.handleReset = () => {
            this.setState({ hasError: false, error: null });
        };
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, errorInfo) {
        // Send to OmniPulse
        try {
            client_1.OmniPulse.captureError(error, {
                ...this.props.meta,
                componentStack: errorInfo.componentStack,
                source: 'react-error-boundary',
            });
        }
        catch {
            // Silent — SDK must never crash
        }
        // Call user's onError callback
        if (this.props.onError) {
            try {
                this.props.onError(error, errorInfo);
            }
            catch {
                // Silent
            }
        }
    }
    render() {
        if (this.state.hasError && this.state.error) {
            const { fallback } = this.props;
            if (typeof fallback === 'function') {
                return fallback(this.state.error, this.handleReset);
            }
            if (fallback) {
                return fallback;
            }
            // Default fallback
            return react_1.default.createElement('div', {
                style: {
                    padding: '2rem',
                    textAlign: 'center',
                    fontFamily: 'system-ui, sans-serif',
                },
            }, react_1.default.createElement('h2', {
                style: { color: '#dc2626', marginBottom: '0.5rem' }
            }, 'Something went wrong'), react_1.default.createElement('p', {
                style: { color: '#6b7280', marginBottom: '1rem' }
            }, this.state.error.message), react_1.default.createElement('button', {
                onClick: this.handleReset,
                style: {
                    padding: '0.5rem 1rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    background: '#fff',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                }
            }, 'Try Again'));
        }
        return this.props.children;
    }
}
exports.OmniPulseErrorBoundary = OmniPulseErrorBoundary;
//# sourceMappingURL=error-boundary.js.map