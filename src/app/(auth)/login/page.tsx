import { AuthLayout } from '../_components/auth-layout';
import { SocialLoginButtons } from '../_components/social-login-buttons';
import { TermsAndConditions } from '../_components/terms-and-conditions';

export default function LoginPage(): React.ReactElement {
  return (
    <AuthLayout title="Log in">
      <SocialLoginButtons />
      <TermsAndConditions />
    </AuthLayout>
  );
}
