// ─────────────────────────────────────────────
// @omnipulse/react — Web Vitals Performance Collector
// Uses native PerformanceObserver (zero dependencies)
// ─────────────────────────────────────────────

import { Transport } from './transport';
import { PerformanceMetric } from './types';

export class PerformanceCollector {
    private transport: Transport;
    private serviceName: string;
    private observers: PerformanceObserver[] = [];

    constructor(transport: Transport, serviceName?: string) {
        this.transport = transport;
        this.serviceName = serviceName || 'react-app';
    }

    /**
     * Start collecting Web Vitals metrics.
     * Safe to call in browser only — no-op in SSR.
     */
    public start(): void {
        if (typeof window === 'undefined' || typeof PerformanceObserver === 'undefined') {
            return;
        }

        this.observeLCP();
        this.observeFID();
        this.observeCLS();
        this.observeFCP();
        this.collectNavigationTiming();
    }

    /**
     * Stop all performance observers.
     */
    public stop(): void {
        for (const obs of this.observers) {
            try {
                obs.disconnect();
            } catch {
                // Silent
            }
        }
        this.observers = [];
    }

    // ─── Largest Contentful Paint ────────────

    private observeLCP(): void {
        try {
            const obs = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const last = entries[entries.length - 1];
                if (last) {
                    this.report('LCP', last.startTime, this.rateMetric('LCP', last.startTime));
                }
            });
            obs.observe({ type: 'largest-contentful-paint', buffered: true });
            this.observers.push(obs);
        } catch {
            // Browser doesn't support LCP
        }
    }

    // ─── First Input Delay ───────────────────

    private observeFID(): void {
        try {
            const obs = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    const fid = (entry as any).processingStart - entry.startTime;
                    this.report('FID', fid, this.rateMetric('FID', fid));
                }
            });
            obs.observe({ type: 'first-input', buffered: true });
            this.observers.push(obs);
        } catch {
            // Browser doesn't support FID
        }
    }

    // ─── Cumulative Layout Shift ─────────────

    private observeCLS(): void {
        try {
            let clsValue = 0;
            let sessionEntries: PerformanceEntry[] = [];
            let sessionValue = 0;

            const obs = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    // Only count entries without recent input
                    if (!(entry as any).hadRecentInput) {
                        const firstEntry = sessionEntries[0];
                        const lastEntry = sessionEntries[sessionEntries.length - 1];

                        // Start new session if gap > 1s or total > 5s
                        if (
                            sessionEntries.length > 0 &&
                            (entry.startTime - (lastEntry?.startTime ?? 0) > 1000 ||
                                entry.startTime - (firstEntry?.startTime ?? 0) > 5000)
                        ) {
                            clsValue = Math.max(clsValue, sessionValue);
                            sessionEntries = [];
                            sessionValue = 0;
                        }

                        sessionEntries.push(entry);
                        sessionValue += (entry as any).value || 0;
                    }
                }

                // Report current max
                const finalCLS = Math.max(clsValue, sessionValue);
                this.report('CLS', finalCLS, this.rateMetric('CLS', finalCLS));
            });
            obs.observe({ type: 'layout-shift', buffered: true });
            this.observers.push(obs);
        } catch {
            // Browser doesn't support CLS
        }
    }

    // ─── First Contentful Paint ──────────────

    private observeFCP(): void {
        try {
            const obs = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.name === 'first-contentful-paint') {
                        this.report('FCP', entry.startTime, this.rateMetric('FCP', entry.startTime));
                    }
                }
            });
            obs.observe({ type: 'paint', buffered: true });
            this.observers.push(obs);
        } catch {
            // Browser doesn't support paint timing
        }
    }

    // ─── Navigation Timing (TTFB) ───────────

    private collectNavigationTiming(): void {
        // Wait for load event to ensure navigation timing is complete
        const collect = () => {
            try {
                const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
                if (!nav) return;

                const ttfb = nav.responseStart - nav.requestStart;
                if (ttfb > 0) {
                    this.report('TTFB', ttfb, this.rateMetric('TTFB', ttfb));
                }

                // Also report page load time
                const pageLoad = nav.loadEventEnd - nav.startTime;
                if (pageLoad > 0) {
                    this.report('PageLoad', pageLoad);
                }
            } catch {
                // Silent
            }
        };

        if (document.readyState === 'complete') {
            setTimeout(collect, 0);
        } else {
            window.addEventListener('load', () => setTimeout(collect, 0));
        }
    }

    // ─── Helpers ─────────────────────────────

    private report(name: string, value: number, rating?: 'good' | 'needs-improvement' | 'poor'): void {
        const metric: PerformanceMetric = {
            name,
            value: Math.round(value * 100) / 100, // 2 decimal places
            rating,
            timestamp: new Date().toISOString(),
            url: typeof window !== 'undefined' ? window.location.href : undefined,
            meta: {
                service: this.serviceName,
            },
        };
        this.transport.addPerformanceMetric(metric);
    }

    /**
     * Rate a metric based on Google Web Vitals thresholds.
     */
    private rateMetric(name: string, value: number): 'good' | 'needs-improvement' | 'poor' | undefined {
        const thresholds: Record<string, [number, number]> = {
            LCP: [2500, 4000],
            FID: [100, 300],
            CLS: [0.1, 0.25],
            FCP: [1800, 3000],
            TTFB: [800, 1800],
        };

        const t = thresholds[name];
        if (!t) return undefined;

        if (value <= t[0]) return 'good';
        if (value <= t[1]) return 'needs-improvement';
        return 'poor';
    }
}
