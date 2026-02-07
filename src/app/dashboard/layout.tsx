import { redirect } from 'next/navigation';

import { getSession } from '@/lib/session';
import { workos } from '@/lib/workos';
import { TooltipProvider } from '@/components/ui/tooltip';

import { DashboardShell } from './_components/dashboard-shell';
import { NoOrgView } from './_components/no-org-view';

async function checkUserOrganization() {
  const session = await getSession();
  
  if (!session?.user) {
    redirect('/sign-in');
  }

  try {
    const memberships = await workos.userManagement.listOrganizationMemberships({
      userId: session.user.id,
    });

    return memberships.data.length > 0;
  } catch (error) {
    console.error('Error checking organization:', error);
    return false;
  }
}

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const hasOrganization = await checkUserOrganization();

  if (!hasOrganization) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <NoOrgView />
      </div>
    );
  }

  return (
    <TooltipProvider>
      <DashboardShell>{children}</DashboardShell>
    </TooltipProvider>
  );
}
