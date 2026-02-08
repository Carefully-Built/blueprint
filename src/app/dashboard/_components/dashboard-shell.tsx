'use client';

import { cn } from '@/lib/utils';
import { OrganizationProvider } from '@/providers';
import { AppSidebar, SidebarProvider, useSidebar } from './app-sidebar';
import type { UserInfo } from './app-sidebar';
import { useSyncUser, type WorkOSUser } from '@/hooks/use-sync-user';

function MainContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();
  
  return (
    <main 
      className={cn(
        "min-h-screen transition-all duration-200 ease-in-out",
        isCollapsed ? "pl-14" : "pl-[220px]"
      )}
    >
      <div className="p-4 lg:p-6">
        {children}
      </div>
    </main>
  );
}

interface DashboardShellProps {
  children: React.ReactNode;
  user: WorkOSUser & UserInfo;
}

export function DashboardShell({ children, user }: DashboardShellProps) {
  useSyncUser(user);

  return (
    <OrganizationProvider initialOrganizationId={user.organizationId}>
      <SidebarProvider>
        <div className="min-h-screen">
          <AppSidebar user={user} />
          <MainContent>{children}</MainContent>
        </div>
      </SidebarProvider>
    </OrganizationProvider>
  );
}
