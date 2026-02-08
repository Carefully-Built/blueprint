import { Building2, User } from 'lucide-react';
import { redirect } from 'next/navigation';

import { AccountSection } from './_components/account-section';
import { OrganizationSection } from './_components/organization-section';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getSession } from '@/lib/session';
import { workos } from '@/lib/workos';

interface OrgInfo {
  id: string;
  name: string;
  role: string;
}

async function getOrganization(userId: string): Promise<OrgInfo | null> {
  try {
    const memberships = await workos.userManagement.listOrganizationMemberships({
      userId,
    });

    const firstMembership = memberships.data[0];
    if (!firstMembership) {
      return null;
    }

    const org = await workos.organizations.getOrganization(
      firstMembership.organizationId
    );

    return {
      id: org.id,
      name: org.name,
      role: firstMembership.role.slug || 'member',
    };
  } catch (err) {
    console.error('Error getting user org:', err);
    return null;
  }
}

export default async function SettingsPage(): Promise<React.ReactElement> {
  const session = await getSession();

  if (!session?.user) {
    redirect('/login');
  }

  const organization = await getOrganization(session.user.id);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold tracking-tight">Settings</h1>

      <Tabs defaultValue="account" className="w-full">
        <TabsList>
          <TabsTrigger value="account" className="gap-1.5">
            <User className="size-3.5" />
            Account
          </TabsTrigger>
          {organization && (
            <TabsTrigger value="organization" className="gap-1.5">
              <Building2 className="size-3.5" />
              Organization
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="account" className="mt-6">
          <AccountSection />
        </TabsContent>

        {organization && (
          <TabsContent value="organization" className="mt-6">
            <OrganizationSection organization={organization} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
