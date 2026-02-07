'use client';

import Image from 'next/image';

import { Button } from '@/components/ui/button';

export interface SocialProvider {
  name: string;
  icon: string;
  action: () => Promise<string>;
}

interface SocialProviderButtonProps {
  provider: SocialProvider;
  disabled?: boolean;
}

export function SocialProviderButton({ provider, disabled }: SocialProviderButtonProps): React.ReactElement {
  const handleClick = async (): Promise<void> => {
    const authUrl = await provider.action();
    window.location.href = authUrl;
  };

  return (
    <Button className="w-full" disabled={disabled} type="button" variant="outline" onClick={(): void => { void handleClick(); }}>
      <Image alt={provider.name} className="mr-2 size-4" height={16} src={provider.icon} width={16} />
      Continue with {provider.name}
    </Button>
  );
}
