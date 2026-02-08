import { redirect } from 'next/navigation';

import { OrganizationTab } from './_components/organization-tab';
import { ProfileTab } from './_components/profile-tab';
import { SecurityTab } from './_components/security-tab';
import { SessionsTab } from './_components/sessions-tab';
import { TeamTab } from './_components/team-tab';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getSession, type SessionData } from '@/lib/session';
import { workos } from '@/lib/workos';
import { getWidgetToken } from '@/lib/workos-widgets';

interface OrgInfo {
  id: string;
  name: string;
  role: string;
}

interface UserAndOrg {
  session: SessionData;
  organization: OrgInfo | null;
}

async function getUserAndOrg(): Promise<UserAndOrg> {
  const session = await getSession();

  if (!session?.user) {
    redirect('/login');
  }

  try {
    const memberships = await workos.userManagement.listOrganizationMemberships({
      userId: session.user.id,
    });

    const firstMembership = memberships.data[0];
    if (!firstMembership) {
      return { session, organization: null };
    }

    const org = await workos.organizations.getOrganization(
      firstMembership.organizationId
    );

    return {
      session,
      organization: {
        id: org.id,
        name: org.name,
        role: firstMembership.role.slug || 'member',
      },
    };
  } catch (err) {
    console.error('Error getting user org:', err);
    return { session, organization: null };
  }
}

export default async function SettingsPage(): Promise<React.ReactElement> {
  const { session, organization } = await getUserAndOrg();
  const accessToken = session.accessToken;

  let teamAuthToken: string | null = null;
  if (organization) {
    try {
      teamAuthToken = await getWidgetToken({
        organizationId: organization.id,
        scopes: ['widgets:users-table:manage'],
      });
    } catch (err) {
      console.error('Error getting widget token:', err);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold tracking-tight">Settings</h1>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          {organization && (
            <>
              <TabsTrigger value="organization">Organization</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
            </>
          )}
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <ProfileTab authToken={accessToken} />
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <SecurityTab authToken={accessToken} />
        </TabsContent>

        <TabsContent value="sessions" className="mt-6">
          <SessionsTab authToken={accessToken} />
        </TabsContent>

        {organization && (
          <>
            <TabsContent value="organization" className="mt-6">
              <OrganizationTab organization={organization} />
            </TabsContent>

            <TabsContent value="team" className="mt-6">
              {teamAuthToken && <TeamTab authToken={teamAuthToken} />}
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}
