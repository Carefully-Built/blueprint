'use client';

import { Building2, ChevronDown, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { CreateOrganization } from './create-organization';

interface Organization {
  id: string;
  name: string;
  role: string;
}

interface SidebarOrgSwitcherProps {
  /** Callback when organization is switched */
  onSwitch?: (orgId: string) => void;
}

/**
 * Organization Switcher for use in sidebars.
 * Fetches organizations and allows switching between them.
 */
export function SidebarOrgSwitcher({ onSwitch }: SidebarOrgSwitcherProps) {
  const router = useRouter();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [currentOrg, setCurrentOrg] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrgs = async () => {
      try {
        const response = await fetch('/api/organizations');
        if (response.ok) {
          const data = await response.json();
          setOrganizations(data.organizations || []);
          if (data.organizations?.length > 0) {
            setCurrentOrg(data.organizations[0]);
          }
        }
      } catch (error) {
        console.error('Failed to fetch organizations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrgs();
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
    // Refresh the organizations list
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
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 p-2">
        <Skeleton className="size-6 rounded" />
        <Skeleton className="h-4 w-24" />
      </div>
    );
  }

  if (organizations.length === 0) {
    return (
      <CreateOrganization onCreated={handleCreated}>
        <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
          <Building2 className="size-4" />
          Create Organization
        </Button>
      </CreateOrganization>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full justify-between gap-2">
          <span className="flex items-center gap-2">
            <Building2 className="size-4" />
            <span className="truncate">{currentOrg?.name || 'Select Org'}</span>
          </span>
          <ChevronDown className="size-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>Organizations</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {organizations.map((org) => (
          <DropdownMenuItem
            key={org.id}
            onClick={() => handleSwitch(org)}
            className={currentOrg?.id === org.id ? 'bg-accent' : ''}
          >
            <Building2 className="mr-2 size-4" />
            <span className="truncate">{org.name}</span>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <CreateOrganization onCreated={handleCreated}>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <Plus className="mr-2 size-4" />
            Create Organization
          </DropdownMenuItem>
        </CreateOrganization>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
