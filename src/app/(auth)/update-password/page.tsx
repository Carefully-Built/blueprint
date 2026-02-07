import { Suspense } from 'react';

import { AuthLayout } from '../_components/auth-layout';

import { UpdatePasswordForm } from './_components/update-password-form';

export default function UpdatePasswordPage(): React.ReactElement {
  return (
    <AuthLayout subtitle="Enter your new password" title="Update password">
      <Suspense fallback={<div className="animate-pulse h-48 bg-muted rounded-lg" />}>
        <UpdatePasswordForm />
      </Suspense>
    </AuthLayout>
  );
}
