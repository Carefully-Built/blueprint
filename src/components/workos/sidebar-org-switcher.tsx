'use client';

import { Building2, ChevronDown, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { CreateOrganization } from './create-organization';

interface Organization {
  id: string;
  name: string;
  role: string;
}

interface SidebarOrgSwitcherProps {
  collapsed?: boolean;
  onSwitch?: (orgId: string) => void;
}

export function SidebarOrgSwitcher({ collapsed = false, onSwitch }: SidebarOrgSwitcherProps) {
  const router = useRouter();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [currentOrg, setCurrentOrg] = useState<Organization | null>(null);

  useEffect(() => {
    fetch('/api/organizations')
      .then(res => res.ok ? res.json() : { organizations: [] })
      .then(data => {
        setOrganizations(data.organizations || []);
        if (data.organizations?.length > 0) {
          setCurrentOrg(data.organizations[0]);
        }
      })
      .catch(() => {});
  }, []);

  const handleSwitch = async (org: Organization) => {
    try {
      const response = await fetch('/api/organizations/switch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ organizationId: org.id }),
      });

      if (response.ok) {
        setCurrentOrg(org);
        onSwitch?.(org.id);
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to switch organization:', error);
    }
  };

  const handleCreated = (orgId: string) => {
    fetch('/api/organizations')
      .then(res => res.json())
      .then(data => {
        setOrganizations(data.organizations || []);
        const newOrg = data.organizations?.find((o: Organization) => o.id === orgId);
        if (newOrg) {
          setCurrentOrg(newOrg);
        }
      });
    onSwitch?.(orgId);
    router.refresh();
  };

  // Get initials for collapsed view
  const initials = currentOrg?.name
    ?.split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'O';

  const dropdownContent = (
    <DropdownMenuContent align={collapsed ? "center" : "start"} className="w-56">
      <DropdownMenuLabel>Organizations</DropdownMenuLabel>
      <DropdownMenuSeparator />
      {organizations.map((org) => (
        <DropdownMenuItem
          key={org.id}
          onClick={() => handleSwitch(org)}
          className={cn(currentOrg?.id === org.id && 'bg-accent')}
        >
          <Building2 className="mr-2 size-4" />
          <span className="truncate">{org.name}</span>
        </DropdownMenuItem>
      ))}
      {organizations.length === 0 && (
        <DropdownMenuItem disabled>No organizations</DropdownMenuItem>
      )}
      <DropdownMenuSeparator />
      <CreateOrganization onCreated={handleCreated}>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <Plus className="mr-2 size-4" />
          Create Organization
        </DropdownMenuItem>
      </CreateOrganization>
    </DropdownMenuContent>
  );

  if (collapsed) {
    return (
      <DropdownMenu>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="w-full h-10">
                <div className="size-8 rounded-md bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                  {initials}
                </div>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="right">{currentOrg?.name || 'Organization'}</TooltipContent>
        </Tooltip>
        {dropdownContent}
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="w-full justify-between h-10 px-2">
          <span className="flex items-center gap-2 min-w-0">
            <div className="size-6 rounded bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
              {initials}
            </div>
            <span className="truncate text-sm">{currentOrg?.name || 'Select Org'}</span>
          </span>
          <ChevronDown className="size-4 opacity-50 shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      {dropdownContent}
    </DropdownMenu>
  );
}
