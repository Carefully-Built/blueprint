import { redirect } from 'next/navigation';

import { getSession } from '@/lib/session';
import { workos } from '@/lib/workos';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreateOrganization } from '@/components/workos';

async function getUserOrganization() {
  const session = await getSession();
  
  if (!session?.user) {
    redirect('/sign-in');
  }

  try {
    // Get user's organization memberships
    const memberships = await workos.userManagement.listOrganizationMemberships({
      userId: session.user.id,
    });

    if (memberships.data.length === 0) {
      return null;
    }

    // Return the first organization
    const firstMembership = memberships.data[0];
    if (!firstMembership) return null;
    
    const org = await workos.organizations.getOrganization(
      firstMembership.organizationId
    );

    return {
      id: org.id,
      name: org.name,
      role: firstMembership.role?.slug || 'member',
    };
  } catch (error) {
    console.error('Error getting user organization:', error);
    return null;
  }
}

export default async function SettingsPage() {
  const session = await getSession();
  const organization = await getUserOrganization();

  // If user has no organization, show prompt to create one
  if (!organization) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create Your Organization</CardTitle>
            <CardDescription>
              Create an organization to invite team members and access all features.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CreateOrganization>
              <Button>Create Organization</Button>
            </CreateOrganization>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>Email:</strong> {session?.user?.email}</p>
            <p><strong>Name:</strong> {session?.user?.firstName} {session?.user?.lastName}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // User has an organization - show full settings
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and organization settings.
        </p>
      </div>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="organization">Organization</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>
        
        <TabsContent value="account" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p><strong>Email:</strong> {session?.user?.email}</p>
              <p><strong>Name:</strong> {session?.user?.firstName} {session?.user?.lastName}</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="organization" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{organization.name}</CardTitle>
              <CardDescription>
                Your role: {organization.role}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Organization ID: {organization.id}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="team" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>
                Invite and manage team members in your organization.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Team management will be available once WorkOS roles are configured.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
