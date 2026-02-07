'use client';

import { Building2, Plus } from 'lucide-react';

import { useWidgetToken } from '@/hooks/use-widget-token';
import { OrgSwitcher } from './org-switcher';
import { CreateOrganization } from './create-organization';
import { WorkOSWidgetsProvider } from './widgets-provider';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface SidebarOrgSwitcherProps {
  /** Callback when organization is switched */
  onSwitch?: (orgId: string) => void;
}

/**
 * Organization Switcher for use in sidebars.
 * Handles token fetching internally.
 * 
 * Usage:
 * ```tsx
 * <SidebarOrgSwitcher 
 *   organizationId={currentOrgId} 
 *   onSwitch={(id) => console.log('Switched to:', id)}
 * />
 * ```
 */
export function SidebarOrgSwitcher({ onSwitch }: SidebarOrgSwitcherProps) {
  const { token, loading, error } = useWidgetToken({
    scopes: ['widgets:organization-switcher:read'],
  });

  if (loading) {
    return (
      <div className="flex items-center gap-2 p-2">
        <Skeleton className="size-8 rounded" />
        <Skeleton className="h-4 w-24" />
      </div>
    );
  }

  if (error || !token) {
    return (
      <div className="flex items-center gap-2 p-2 text-muted-foreground">
        <Building2 className="size-4" />
        <span className="text-sm">Organization</span>
      </div>
    );
  }

  return (
    <WorkOSWidgetsProvider>
      <OrgSwitcher 
        authToken={token}
        onSwitch={onSwitch}
      >
        <CreateOrganization onCreated={onSwitch}>
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
            <Plus className="size-4" />
            Create Organization
          </Button>
        </CreateOrganization>
      </OrgSwitcher>
    </WorkOSWidgetsProvider>
  );
}
