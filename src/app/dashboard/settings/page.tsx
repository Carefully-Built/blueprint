import { redirect } from 'next/navigation';

import { getSession } from '@/lib/session';
import { workos } from '@/lib/workos';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { AccountTab } from './_components/account-tab';
import { OrganizationTab } from './_components/organization-tab';
import { TeamTab } from './_components/team-tab';

async function getUserAndOrg() {
  const session = await getSession();
  
  if (!session?.user) {
    redirect('/sign-in');
  }

  try {
    const memberships = await workos.userManagement.listOrganizationMemberships({
      userId: session.user.id,
    });

    const firstMembership = memberships.data[0];
    if (!firstMembership) {
      return { user: session.user, organization: null };
    }
    
    const org = await workos.organizations.getOrganization(
      firstMembership.organizationId
    );

    return {
      user: session.user,
      organization: {
        id: org.id,
        name: org.name,
        role: firstMembership.role?.slug || 'member',
      },
    };
  } catch (error) {
    console.error('Error getting user org:', error);
    return { user: session.user, organization: null };
  }
}

export default async function SettingsPage() {
  const { user, organization } = await getUserAndOrg();

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold tracking-tight">Settings</h1>

      <Tabs defaultValue="account" className="w-full">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          {organization && (
            <>
              <TabsTrigger value="organization">Organization</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
            </>
          )}
        </TabsList>
        
        <TabsContent value="account" className="mt-6">
          <AccountTab user={user} />
        </TabsContent>
        
        {organization && (
          <>
            <TabsContent value="organization" className="mt-6">
              <OrganizationTab organization={organization} />
            </TabsContent>
            
            <TabsContent value="team" className="mt-6">
              <TeamTab organizationId={organization.id} />
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}
