import { AuthLayout } from '../_components/auth-layout';

import { ForgotPasswordForm } from './_components/forgot-password-form';

export default function ForgotPasswordPage(): React.ReactElement {
  return (
    <AuthLayout subtitle="Enter your email to receive a password reset link" title="Forgot password">
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
