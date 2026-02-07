import { redirect } from 'next/navigation';

import { getSession } from '@/lib/session';
import { workos } from '@/lib/workos';
import { TooltipProvider } from '@/components/ui/tooltip';

import { AppSidebar } from './_components/app-sidebar';
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

  // If user has no organization, show create org view
  if (!hasOrganization) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <NoOrgView />
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen">
        <AppSidebar />
        <main className="pl-[72px] lg:pl-[240px] transition-all duration-200">
          <div className="p-4 lg:p-6">
            {children}
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
}
