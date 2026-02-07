import { AuthLayout } from '../_components/auth-layout';

import { UpdatePasswordForm } from './_components/update-password-form';

export default function UpdatePasswordPage(): React.ReactElement {
  return (
    <AuthLayout subtitle="Enter your new password" title="Update password">
      <UpdatePasswordForm />
    </AuthLayout>
  );
}
