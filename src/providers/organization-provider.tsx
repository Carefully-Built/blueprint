'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

import type { ReactNode } from 'react';

interface OrganizationContextValue {
  organizationId: string | null;
  setOrganizationId: (id: string | null) => void;
  refreshOrganization: () => void;
}

const OrganizationContext = createContext<OrganizationContextValue | null>(null);

interface OrganizationProviderProps {
  children: ReactNode;
  initialOrganizationId?: string;
}

export function OrganizationProvider({
  children,
  initialOrganizationId,
}: OrganizationProviderProps): React.ReactElement {
  const [organizationId, setOrganizationId] = useState<string | null>(
    initialOrganizationId ?? null
  );

  const refreshOrganization = useCallback((): void => {
    // Fetch current org from API
    fetch('/api/organizations')
      .then((res) => (res.ok ? res.json() : { organizations: [] }))
      .then((data: { organizations: { id: string }[] }) => {
        if (data.organizations.length > 0 && data.organizations[0]) {
          setOrganizationId(data.organizations[0].id);
        }
      })
      .catch(() => {
        // Silently fail
      });
  }, []);

  useEffect(() => {
    const handleOrgUpdate = (): void => {
      refreshOrganization();
    };

    window.addEventListener('org-updated', handleOrgUpdate);
    return (): void => {
      window.removeEventListener('org-updated', handleOrgUpdate);
    };
  }, [refreshOrganization]);

  return (
    <OrganizationContext.Provider
      value={{ organizationId, setOrganizationId, refreshOrganization }}
    >
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganization(): OrganizationContextValue {
  const context = useContext(OrganizationContext);
  if (!context) {
    throw new Error('useOrganization must be used within OrganizationProvider');
  }
  return context;
}
