"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OmniPulseProvider = OmniPulseProvider;
exports.useOmniPulseContext = useOmniPulseContext;
const jsx_runtime_1 = require("react/jsx-runtime");
// ─────────────────────────────────────────────
// @omnipulse/react — React Provider
// Context provider for OmniPulse SDK
// ─────────────────────────────────────────────
const react_1 = require("react");
const client_1 = require("../client");
const OmniPulseContext = (0, react_1.createContext)(client_1.OmniPulse);
/**
 * OmniPulseProvider — Initialize and provide OmniPulse SDK to React tree.
 *
 * @example
 * ```tsx
 * import { OmniPulseProvider } from '@omnipulse/react';
 *
 * function App() {
 *   return (
 *     <OmniPulseProvider config={{
 *       apiKey: 'your-ingest-key',
 *       serviceName: 'my-react-app',
 *       endpoint: 'https://api.omnipulse.cloud',
 *     }}>
 *       <YourApp />
 *     </OmniPulseProvider>
 *   );
 * }
 * ```
 */
function OmniPulseProvider({ config, children }) {
    const initialized = (0, react_1.useRef)(false);
    (0, react_1.useEffect)(() => {
        if (!initialized.current) {
            client_1.OmniPulse.init(config);
            initialized.current = true;
        }
        return () => {
            // Cleanup on unmount — flush pending data
            client_1.OmniPulse.shutdown();
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    return ((0, jsx_runtime_1.jsx)(OmniPulseContext.Provider, { value: client_1.OmniPulse, children: children }));
}
/**
 * Internal hook to get OmniPulse context.
 * Exported for use by other hooks.
 */
function useOmniPulseContext() {
    return (0, react_1.useContext)(OmniPulseContext);
}
//# sourceMappingURL=provider.js.map