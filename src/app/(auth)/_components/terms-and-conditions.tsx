export function TermsAndConditions(): React.ReactElement {
  return (
    <p className="mt-4 text-center text-xs text-muted-foreground">
      By continuing, you agree to our{' '}
      <a className="underline" href="/terms" rel="noopener noreferrer" target="_blank">
        Terms of Service
      </a>{' '}
      and{' '}
      <a className="underline" href="/privacy" rel="noopener noreferrer" target="_blank">
        Privacy Policy
      </a>
      .
    </p>
  );
}
