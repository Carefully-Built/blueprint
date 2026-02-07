import { NextResponse } from 'next/server';

import type { NextRequest} from 'next/server';

import { getSession, createSession } from '@/lib/session';
import { workos, WORKOS_CLIENT_ID, WORKOS_REDIRECT_URI } from '@/lib/workos';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { organizationId } = await request.json();

    if (!organizationId) {
      return NextResponse.json({ error: 'Organization ID required' }, { status: 400 });
    }

    // Get the organization to check if it requires SSO
    const org = await workos.organizations.getOrganization(organizationId);

    // Check if organization has verified domains (requires SSO)
    const requiresSSO = org.domains?.some(d => d.state === 'verified');

    if (requiresSSO) {
      // User needs to re-authenticate with the organization's SSO
      const authUrl = workos.userManagement.getAuthorizationUrl({
        clientId: WORKOS_CLIENT_ID,
        redirectUri: WORKOS_REDIRECT_URI,
        organizationId,
        provider: 'authkit',
      });

      return NextResponse.json({ redirectUrl: authUrl });
    }

    // No SSO required - update the session with new organization
    // Note: This assumes the user has access to the organization
    await createSession({
      user: {
        ...session.user,
        // Update organization context in session if needed
      },
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
    });

    return NextResponse.json({ success: true, organizationId });
  } catch (error) {
    console.error('Error switching organization:', error);
    return NextResponse.json({ error: 'Failed to switch organization' }, { status: 500 });
  }
}
