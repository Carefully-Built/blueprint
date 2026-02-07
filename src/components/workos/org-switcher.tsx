'use client';

import { OrganizationSwitcher as WorkOSOrgSwitcher } from '@workos-inc/widgets';
import { useRouter } from 'next/navigation';


interface OrgSwitcherProps {
  authToken: string;
  onSwitch?: (orgId: string) => void;
  children?: React.ReactNode;
  organizationLabel?: string | null;
}

export function OrgSwitcher({
  authToken,
  onSwitch,
  children,
  organizationLabel = 'Organizations',
}: OrgSwitcherProps): React.ReactElement {
  const router = useRouter();

  const handleSwitch = async ({ organizationId }: { organizationId: string }): Promise<void> => {
    const response = await fetch('/api/organizations/switch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ organizationId }),
    });

    if (!response.ok) {
      throw new Error('Failed to switch organization');
    }

    const data = (await response.json()) as { redirectUrl?: string };

    if (data.redirectUrl) {
      window.location.href = data.redirectUrl;
      return;
    }

    onSwitch?.(organizationId);
    router.refresh();
  };

  return (
    <WorkOSOrgSwitcher
      authToken={authToken}
      organizationLabel={organizationLabel}
      switchToOrganization={handleSwitch}
    >
      {children}
    </WorkOSOrgSwitcher>
  );
}
