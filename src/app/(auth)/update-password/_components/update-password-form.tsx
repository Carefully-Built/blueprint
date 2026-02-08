'use client';

import { FormProvider } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { CustomPasswordField } from '@/components/forms';
import { useUpdatePasswordForm } from '@/hooks/use-update-password-form';

export function UpdatePasswordForm(): React.ReactElement {
  const { form, onSubmit, loading, error, token } = useUpdatePasswordForm();

  if (!token) {
    return (
      <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
        Invalid or missing reset token. Please request a new password reset link.
      </div>
    );
  }

  return (
    <FormProvider {...form}>
      <form 
        className="space-y-4" 
        onSubmit={(e): void => { void form.handleSubmit(onSubmit)(e); }}
      >
        <CustomPasswordField
          name="password"
          label="New password"
          placeholder="At least 8 characters"
          autoComplete="new-password"
          disabled={loading}
        />

        <CustomPasswordField
          name="confirmPassword"
          label="Confirm password"
          placeholder="Re-enter your password"
          autoComplete="new-password"
          disabled={loading}
        />

        {error && (
          <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <Button className="w-full" disabled={loading} type="submit">
          {loading ? 'Updating...' : 'Update password'}
        </Button>
      </form>
    </FormProvider>
  );
}
