'use client';

import Link from 'next/link';
import { FormProvider } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { CustomInputField, CustomPasswordField } from '@/components/forms';
import { useLoginForm } from '@/hooks/use-login-form';

export function LoginWithEmailForm(): React.ReactElement {
  const { form, onSubmit, loading, error } = useLoginForm();

  return (
    <FormProvider {...form}>
      <form 
        className="space-y-3" 
        onSubmit={(e): void => { void form.handleSubmit(onSubmit)(e); }}
      >
        <CustomInputField
          name="email"
          label="Email"
          placeholder="you@example.com"
          type="email"
          disabled={loading}
        />

        <div className="space-y-2">
          <CustomPasswordField
            name="password"
            label="Password"
            autoComplete="current-password"
            disabled={loading}
          />
          <div className="flex justify-end">
            <Link className="text-sm underline-offset-4 hover:underline" href="/forgot-password">
              Forgot password?
            </Link>
          </div>
        </div>

        {error && (
          <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <Button className="w-full" disabled={loading} type="submit">
          {loading ? 'Logging in...' : 'Log in'}
        </Button>
      </form>
    </FormProvider>
  );
}
