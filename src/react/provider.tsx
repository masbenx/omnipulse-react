// ─────────────────────────────────────────────
// @omnipulse/react — React Provider
// Context provider for OmniPulse SDK
// ─────────────────────────────────────────────

import React, { createContext, useContext, useEffect, useRef } from 'react';
import { OmniPulse, OmniPulseClient } from '../client';
import { OmniPulseConfig } from '../types';

const OmniPulseContext = createContext<OmniPulseClient>(OmniPulse);

export interface OmniPulseProviderProps {
    config: OmniPulseConfig;
    children: React.ReactNode;
}

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
export function OmniPulseProvider({ config, children }: OmniPulseProviderProps) {
    const initialized = useRef(false);

    useEffect(() => {
        if (!initialized.current) {
            OmniPulse.init(config);
            initialized.current = true;
        }

        return () => {
            // Cleanup on unmount — flush pending data
            OmniPulse.shutdown();
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <OmniPulseContext.Provider value={OmniPulse}>
            {children}
        </OmniPulseContext.Provider>
    );
}

/**
 * Internal hook to get OmniPulse context.
 * Exported for use by other hooks.
 */
export function useOmniPulseContext(): OmniPulseClient {
    return useContext(OmniPulseContext);
}
