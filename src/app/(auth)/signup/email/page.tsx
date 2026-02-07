import { AuthBottomNav } from '../../_components/auth-bottom-nav';
import { AuthLayout } from '../../_components/auth-layout';
import { TermsAndConditions } from '../../_components/terms-and-conditions';

import { SignUpWithEmailForm } from './_components/signup-with-email-form';

export default function SignUpWithEmailPage(): React.ReactElement {
  return (
    <AuthLayout title="Sign up with email">
      <AuthBottomNav linkPath="/login/email" linkText="Log in" text="Already have an account?" />
      <SignUpWithEmailForm />
      <TermsAndConditions />
    </AuthLayout>
  );
}
