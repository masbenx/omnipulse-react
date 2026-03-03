# @omnipulse/react

Official React SDK for [OmniPulse](https://omnipulse.cloud) — Real-time monitoring, error tracking, logging, and Web Vitals for React 19+ applications.

## Features

- 🛡️ **Error Boundary** — Automatic React error capture with customizable fallback
- 📊 **Web Vitals** — LCP, FID, CLS, FCP, TTFB collection (zero dependencies)
- 📝 **Structured Logging** — `info`, `warn`, `error`, `debug` levels
- 🌐 **Global Error Capture** — `window.onerror` & `unhandledrejection`
- ⚡ **Zero Dependencies** — Only `react` as peerDependency
- 🔒 **Fail-Safe** — SDK never crashes your application
- 📦 **Batching & SendBeacon** — Reliable delivery even on page close

## Quick Start

### 1. Install

```bash
npm install @omnipulse/react
```

### 2. Wrap Your App

```tsx
// main.tsx
import { OmniPulseProvider, OmniPulseErrorBoundary } from '@omnipulse/react';

function App() {
  return (
    <OmniPulseProvider config={{
      apiKey: 'your-ingest-key',
      serviceName: 'my-react-app',
      endpoint: 'https://api.omnipulse.cloud',
      environment: 'production',
    }}>
      <OmniPulseErrorBoundary
        fallback={(error, reset) => (
          <div>
            <h2>Something went wrong</h2>
            <p>{error.message}</p>
            <button onClick={reset}>Try Again</button>
          </div>
        )}
      >
        <YourApp />
      </OmniPulseErrorBoundary>
    </OmniPulseProvider>
  );
}
```

### 3. Use Hooks

```tsx
import { useLogger, useErrorCapture } from '@omnipulse/react';

function Dashboard() {
  const logger = useLogger();
  const captureError = useErrorCapture();

  useEffect(() => {
    logger.info('Dashboard loaded', { userId: user.id });
  }, []);

  const handleSubmit = async () => {
    try {
      await api.submit(data);
      logger.info('Form submitted');
    } catch (err) {
      captureError(err as Error, { form: 'dashboard' });
    }
  };

  return <button onClick={handleSubmit}>Submit</button>;
}
```

### 4. Without Provider (Vanilla)

```tsx
import { OmniPulse } from '@omnipulse/react';

OmniPulse.init({
  apiKey: 'your-ingest-key',
  serviceName: 'my-react-app',
});

// Log
OmniPulse.logger.info('App started');

// Manual error capture
try {
  riskyOperation();
} catch (err) {
  OmniPulse.captureError(err as Error);
}

// Test connection
const result = await OmniPulse.test();
console.log(result); // { success: true, message: '...' }
```

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `apiKey` | `string` | *required* | Your OmniPulse Ingest Key |
| `serviceName` | `string` | `'react-app'` | Application name |
| `environment` | `string` | `'production'` | Environment tag |
| `endpoint` | `string` | `'https://api.omnipulse.cloud'` | Backend URL |
| `debug` | `boolean` | `false` | Enable console debug logs |
| `enableErrorTracking` | `boolean` | `true` | Auto-install global error capture |
| `enablePerformance` | `boolean` | `true` | Auto-collect Web Vitals |
| `flushIntervalMs` | `number` | `5000` | Batch flush interval (ms) |
| `batchSize` | `number` | `50` | Max entries before auto-flush |

## API Reference

### Hooks

| Hook | Returns | Description |
|------|---------|-------------|
| `useOmniPulse()` | `OmniPulseClient` | Access the SDK instance |
| `useLogger()` | `Logger` | Access structured logger |
| `useErrorCapture()` | `(error, meta?) => void` | Memoized error capture function |

### Components

| Component | Description |
|-----------|-------------|
| `<OmniPulseProvider>` | Initializes SDK and provides context |
| `<OmniPulseErrorBoundary>` | Auto-captures React errors |

## License

MIT
