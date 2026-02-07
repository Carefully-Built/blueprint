'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';

import { getGoogleAuthUrl } from '../actions';

import { SocialProviderButton, type SocialProvider } from './social-provider-button';

const providers: SocialProvider[] = [
  {
    name: 'Google',
    icon: '/images/icons/google.svg',
    action: getGoogleAuthUrl,
  },
];

export function SocialLoginButtons(): React.ReactElement {
  return (
    <div className="mt-4 space-y-2">
      {providers.map((provider) => (
        <SocialProviderButton key={provider.name} provider={provider} />
      ))}

      <Link className="block" href="/login/email">
        <Button className="w-full" variant="outline">
          Continue with email
        </Button>
      </Link>
    </div>
  );
}
