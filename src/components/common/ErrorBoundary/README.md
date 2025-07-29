# ErrorBoundary Component

A React error boundary component that catches JavaScript errors anywhere in the child component tree and displays a fallback UI with retry functionality.

## Features

- **Error Catching**: Catches JavaScript errors in child components
- **Fallback UI**: Displays a user-friendly error overlay
- **Retry Functionality**: Allows users to reset the error state and try again
- **Custom Fallbacks**: Support for custom error UI components
- **Error Logging**: Optional error logging and callbacks
- **Responsive Design**: Mobile-friendly error display
- **Accessibility**: Proper ARIA labels and keyboard navigation

## Usage

### Basic Usage

```tsx
import { ErrorBoundary } from "@/components/common/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <YourComponent />
    </ErrorBoundary>
  );
}
```

### With Custom Fallback

```tsx
import { ErrorBoundary } from "@/components/common/ErrorBoundary";

function CustomErrorFallback({ error, resetError }: { error: Error; resetError: () => void }) {
  return (
    <div className="custom-error">
      <h2>Custom Error Message</h2>
      <p>{error.message}</p>
      <button onClick={resetError}>Retry</button>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary fallback={CustomErrorFallback}>
      <YourComponent />
    </ErrorBoundary>
  );
}
```

### With Error Callbacks

```tsx
import { ErrorBoundary } from "@/components/common/ErrorBoundary";

function App() {
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    // Log error to external service
    console.error("Error caught:", error, errorInfo);
  };

  const handleReset = () => {
    // Perform cleanup or state reset
    console.log("Error boundary reset");
  };

  return (
    <ErrorBoundary onError={handleError} onReset={handleReset}>
      <YourComponent />
    </ErrorBoundary>
  );
}
```

### Using the Hook

```tsx
import { useErrorBoundary } from "@/components/common/ErrorBoundary";

function MyComponent() {
  const { hasError, error, resetError, setError } = useErrorBoundary();

  const handleRiskyOperation = async () => {
    try {
      // Some risky operation
      await someAsyncOperation();
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    }
  };

  if (hasError && error) {
    return (
      <div>
        <p>Error: {error.message}</p>
        <button onClick={resetError}>Retry</button>
      </div>
    );
  }

  return (
    <div>
      <button onClick={handleRiskyOperation}>Perform Risky Operation</button>
    </div>
  );
}
```

## Props

### ErrorBoundaryProps

| Prop        | Type                                                               | Default | Description                                |
| ----------- | ------------------------------------------------------------------ | ------- | ------------------------------------------ |
| `children`  | `ReactNode`                                                        | -       | The components to wrap with error boundary |
| `fallback`  | `ReactNode \| (error: Error, resetError: () => void) => ReactNode` | -       | Custom fallback UI component or function   |
| `onError`   | `(error: Error, errorInfo: React.ErrorInfo) => void`               | -       | Callback called when an error is caught    |
| `onReset`   | `() => void`                                                       | -       | Callback called when error is reset        |
| `className` | `string`                                                           | -       | Additional CSS classes for the container   |

### ErrorOverlayProps

| Prop        | Type         | Default | Description                            |
| ----------- | ------------ | ------- | -------------------------------------- |
| `error`     | `Error`      | -       | The error object to display            |
| `onReset`   | `() => void` | -       | Function to call when retry is clicked |
| `className` | `string`     | -       | Additional CSS classes for the overlay |

## Hook API

### useErrorBoundary

Returns an object with the following properties:

| Property     | Type                     | Description                       |
| ------------ | ------------------------ | --------------------------------- |
| `hasError`   | `boolean`                | Whether an error has occurred     |
| `error`      | `Error \| null`          | The current error object          |
| `resetError` | `() => void`             | Function to reset the error state |
| `setError`   | `(error: Error) => void` | Function to set an error          |

## Error Boundary Lifecycle

1. **Normal Operation**: Component renders children normally
2. **Error Occurs**: JavaScript error is thrown in child component
3. **Error Caught**: `getDerivedStateFromError` is called, state is updated
4. **Fallback Rendered**: Error overlay is displayed instead of children
5. **User Retries**: User clicks retry button, error state is reset
6. **Normal Operation**: Component returns to normal operation

## Best Practices

### 1. Place Error Boundaries Strategically

```tsx
// Wrap major sections of your app
<ErrorBoundary>
  <Header />
</ErrorBoundary>

<ErrorBoundary>
  <MainContent />
</ErrorBoundary>

<ErrorBoundary>
  <Footer />
</ErrorBoundary>
```

### 2. Use Custom Fallbacks for Different Contexts

```tsx
// Different fallbacks for different components
<ErrorBoundary fallback={<DataErrorFallback />}>
  <DataComponent />
</ErrorBoundary>

<ErrorBoundary fallback={<UIErrorFallback />}>
  <UIComponent />
</ErrorBoundary>
```

### 3. Log Errors Appropriately

```tsx
const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
  // Log to external service in production
  if (process.env.NODE_ENV === "production") {
    logErrorToService(error, errorInfo);
  }

  // Always log to console in development
  console.error("Error caught:", error, errorInfo);
};
```

### 4. Handle Async Errors

```tsx
// Error boundaries don't catch async errors
// Use try-catch or the hook for async operations
const handleAsyncOperation = async () => {
  try {
    await someAsyncOperation();
  } catch (error) {
    setError(error instanceof Error ? error : new Error("Async error"));
  }
};
```

## Limitations

- **Async Errors**: Error boundaries don't catch errors in async code (promises, setTimeout, etc.)
- **Event Handlers**: Errors in event handlers must be caught manually
- **Server-Side Rendering**: Error boundaries only work on the client side
- **Error Recovery**: Some errors may require a full page reload to recover

## Accessibility

The ErrorBoundary component includes:

- Proper ARIA labels for error messages
- Keyboard navigation support
- Screen reader friendly error descriptions
- High contrast error styling
- Focus management for retry buttons

## Styling

The component uses CSS modules for styling and includes:

- Responsive design for mobile devices
- Dark/light theme support
- Smooth animations and transitions
- Consistent spacing and typography
- Accessible color contrast ratios
