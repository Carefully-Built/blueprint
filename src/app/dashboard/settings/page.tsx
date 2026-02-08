import { Building2, User } from 'lucide-react';
import { redirect } from 'next/navigation';

import { AccountSection } from './_components/account-section';
import { OrganizationSection } from './_components/organization-section';

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
  sessionId: string | null;
}

interface JwtPayload {
  sid?: string;
  sub?: string;
  exp?: number;
  iat?: number;
}

function base64UrlDecode(str: string): string {
  // Convert base64url to base64
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  // Pad with '=' if necessary
  const padding = base64.length % 4;
  if (padding) {
    base64 += '='.repeat(4 - padding);
  }
  return Buffer.from(base64, 'base64').toString();
}

function extractSessionId(accessToken: string): string | null {
  try {
    // JWT format: header.payload.signature
    const parts = accessToken.split('.');
    if (parts.length !== 3 || !parts[1]) return null;
    
    const payload = JSON.parse(base64UrlDecode(parts[1])) as JwtPayload;
    return payload.sid ?? null;
  } catch (err) {
    console.error('Error extracting session ID:', err);
    return null;
  }
}

async function getUserAndOrg(): Promise<UserAndOrg> {
  const session = await getSession();

  if (!session?.user) {
    redirect('/login');
  }

  const sessionId = extractSessionId(session.accessToken);

  try {
    const memberships = await workos.userManagement.listOrganizationMemberships({
      userId: session.user.id,
    });

    const firstMembership = memberships.data[0];
    if (!firstMembership) {
      return { session, organization: null, sessionId };
    }

    const org = await workos.organizations.getOrganization(
      firstMembership.organizationId
    );

    const roleSlug = firstMembership.role.slug;

    return {
      session,
      organization: {
        id: org.id,
        name: org.name,
        role: roleSlug || 'member',
      },
      sessionId,
    };
  } catch (err) {
    console.error('Error getting user org:', err);
    return { session, organization: null, sessionId };
  }
}

export default async function SettingsPage(): Promise<React.ReactElement> {
  const { session, organization, sessionId } = await getUserAndOrg();
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
          <AccountSection 
            authToken={accessToken} 
            sessionId={sessionId}
          />
        </TabsContent>

        {organization && (
          <TabsContent value="organization" className="mt-6">
            <OrganizationSection 
              organization={organization}
              teamAuthToken={teamAuthToken}
            />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
