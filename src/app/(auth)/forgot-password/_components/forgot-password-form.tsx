'use client';

import Link from 'next/link';
import { FormProvider } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { CustomInputField } from '@/components/forms/CustomInputField';

import { useForgotPassword } from './use-forgot-password';

export function ForgotPasswordForm(): React.ReactElement {
  const { form, onSubmit, loading, sent, error, email } = useForgotPassword();

  if (sent) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-sm text-muted-foreground">
          We&apos;ve sent a password reset link to <strong>{email}</strong>
        </p>
        <Link className="text-sm underline" href="/login/email">
          Back to log in
        </Link>
      </div>
    );
  }

  return (
    <FormProvider {...form}>
      <form className="space-y-4" onSubmit={(e): void => { void form.handleSubmit(onSubmit)(e); }}>
        <CustomInputField
          name="email"
          label="Email"
          placeholder="you@example.com"
          type="email"
          autoFocus
          disabled={loading}
        />

        {error && <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">{error}</div>}

        <Button className="w-full" disabled={loading} type="submit">
          {loading ? 'Sending...' : 'Send reset link'}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          <Link className="underline" href="/login/email">
            Back to log in
          </Link>
        </p>
      </form>
    </FormProvider>
  );
}
