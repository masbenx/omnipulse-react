import React from 'react';
import { OmniPulseClient } from '../client';
import { OmniPulseConfig } from '../types';
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
export declare function OmniPulseProvider({ config, children }: OmniPulseProviderProps): import("react/jsx-runtime").JSX.Element;
/**
 * Internal hook to get OmniPulse context.
 * Exported for use by other hooks.
 */
export declare function useOmniPulseContext(): OmniPulseClient;
//# sourceMappingURL=provider.d.ts.map