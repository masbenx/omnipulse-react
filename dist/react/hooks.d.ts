import { Logger } from '../logger';
import { OmniPulseClient } from '../client';
export declare function useOmniPulse(): OmniPulseClient;
export declare function useLogger(): Logger;
export declare function useErrorCapture(): (error: Error, meta?: Record<string, any>) => void;
