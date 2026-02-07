'use client';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const GlobalError = ({ error, reset }: GlobalErrorProps): React.ReactElement => (
  <html lang="en">
    <body className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background font-sans text-foreground">
      <h1 className="text-9xl font-bold opacity-30">500</h1>
      <h2 className="text-2xl font-semibold">Critical Error</h2>
      <p className="max-w-md text-center opacity-70">
        Something went seriously wrong. Please try refreshing the page.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-4 rounded-md bg-neutral-900 px-6 py-2 text-sm font-medium text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900"
      >
        Refresh Page
      </button>
      {error.digest && (
        <p className="mt-4 text-xs opacity-50">Error ID: {error.digest}</p>
      )}
    </body>
  </html>
);

export default GlobalError;
