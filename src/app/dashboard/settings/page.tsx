import { redirect } from 'next/navigation';
import { Suspense } from 'react';

import { getSession } from '@/lib/session';
import { getWidgetToken } from '@/lib/workos-widgets';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { WorkOSWidgetsProvider } from '@/components/workos/widgets-provider';

import { ProfileTab } from './_components/profile-tab';
import { SecurityTab } from './_components/security-tab';
import { TeamTab } from './_components/team-tab';
import { SessionsTab } from './_components/sessions-tab';

async function getTokens() {
  const session = await getSession();
  
  if (!session?.user) {
    redirect('/sign-in');
  }

  // Get tokens for each widget type
  // Note: All use 'widgets:users-table:manage' as WorkOS requires manage for most operations
  const [profileToken, securityToken, teamToken] = await Promise.all([
    getWidgetToken({ scopes: ['widgets:users-table:manage'] }),
    getWidgetToken({ scopes: ['widgets:users-table:manage'] }),
    getWidgetToken({ 
      organizationId: 'default', // Replace with actual org ID from context
      scopes: ['widgets:users-table:manage'] 
    }),
  ]);

  return { profileToken, securityToken, teamToken };
}

export default async function SettingsPage() {
  const tokens = await getTokens();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <WorkOSWidgetsProvider>
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="mt-6">
            <Suspense fallback={<WidgetSkeleton />}>
              <ProfileTab authToken={tokens.profileToken} />
            </Suspense>
          </TabsContent>
          
          <TabsContent value="security" className="mt-6">
            <Suspense fallback={<WidgetSkeleton />}>
              <SecurityTab authToken={tokens.securityToken} />
            </Suspense>
          </TabsContent>
          
          <TabsContent value="team" className="mt-6">
            <Suspense fallback={<WidgetSkeleton />}>
              <TeamTab authToken={tokens.teamToken} />
            </Suspense>
          </TabsContent>
          
          <TabsContent value="sessions" className="mt-6">
            <Suspense fallback={<WidgetSkeleton />}>
              <SessionsTab authToken={tokens.securityToken} />
            </Suspense>
          </TabsContent>
        </Tabs>
      </WorkOSWidgetsProvider>
    </div>
  );
}

function WidgetSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-12 w-1/2" />
    </div>
  );
}
