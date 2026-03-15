## [v0.1.3] - 2026-03-15
### Changed
- Automated release via script.

## [v0.1.2] - 2026-03-09
### Fixed
- Align `ErrorEntry` payload fields with backend DTO: `url` → `route`
- Rebuild dist output with corrected field mappings

## [v0.1.1] - 2026-03-03
### Changed
- Automated release via script.

# Changelog

## [v0.1.0] - 2026-03-03

### Added
- Initial release of `@omnipulse/react` SDK
- `OmniPulseProvider` — React context provider for initialization
- `OmniPulseErrorBoundary` — automatic error capture boundary
- `useOmniPulse()`, `useLogger()`, `useErrorCapture()` hooks
- `Logger` — structured logging (info/warn/error/debug)
- `ErrorTracker` — global `window.onerror` & `unhandledrejection` capture
- `PerformanceCollector` — Web Vitals (LCP, FID, CLS, TTFB, FCP)
- `Transport` — browser `fetch()` with batching & `sendBeacon` on unload
