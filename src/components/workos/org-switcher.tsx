'use client';

import { OrganizationSwitcher as WorkOSOrgSwitcher } from '@workos-inc/widgets';
import { useRouter } from 'next/navigation';

interface OrgSwitcherProps {
  /** Auth token from getWidgetToken server action */
  authToken: string;
  /** Callback when organization is switched */
  onSwitch?: (orgId: string) => void;
  /** Children for create organization action */
  children?: React.ReactNode;
  /** Label for the organizations section */
  organizationLabel?: string | null;
}

/**
 * Organization Switcher widget.
 * Allows users to switch between organizations they belong to.
 * 
 * Usage:
 * ```tsx
 * const token = await getWidgetToken({ scopes: ['widgets:organization-switcher:read'] });
 * <OrgSwitcher authToken={token} />
 * ```
 */
export function OrgSwitcher({ 
  authToken, 
  onSwitch,
  children,
  organizationLabel = 'Organizations'
}: OrgSwitcherProps) {
  const router = useRouter();

  const handleSwitch = async ({ organizationId }: { organizationId: string }) => {
    // Call the switch organization API endpoint
    const response = await fetch('/api/organizations/switch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ organizationId }),
    });

    if (!response.ok) {
      throw new Error('Failed to switch organization');
    }

    const data = await response.json();
    
    // If re-auth is required (SSO/MFA), redirect
    if (data.redirectUrl) {
      window.location.href = data.redirectUrl;
      return;
    }

    // Callback for additional handling
    onSwitch?.(organizationId);

    // Refresh the current page
    router.refresh();
  };

  return (
    <WorkOSOrgSwitcher
      authToken={authToken}
      switchToOrganization={handleSwitch}
      organizationLabel={organizationLabel}
    >
      {children}
    </WorkOSOrgSwitcher>
  );
}
