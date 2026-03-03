import React from 'react';
import { OmniPulseClient } from '../client';
import { OmniPulseConfig } from '../types';
export interface OmniPulseProviderProps {
    config: OmniPulseConfig;
    children: React.ReactNode;
}
export declare function OmniPulseProvider({ config, children }: OmniPulseProviderProps): import("react/jsx-runtime").JSX.Element;
export declare function useOmniPulseContext(): OmniPulseClient;
