import { AuthBottomNav } from '../../_components/auth-bottom-nav';
import { AuthLayout } from '../../_components/auth-layout';

import { LoginWithEmailForm } from './_components/login-with-email-form';

export default function LoginEmailPage(): React.ReactElement {
  return (
    <AuthLayout title="Log in with email">
      <AuthBottomNav linkPath="/signup/email" linkText="Sign up" text="Don't have an account?" />
      <LoginWithEmailForm />
    </AuthLayout>
  );
}
