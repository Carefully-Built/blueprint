import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

import { getSession } from '@/lib/session';
import { workos } from '@/lib/workos';

/**
 * All widget scopes needed for Profile, Security, Sessions, and Team widgets
 */
const WIDGET_SCOPES = [
  'widgets:users-table:manage',
  'widgets:api-keys:manage', 
  'widgets:domain-verification:manage',
  'widgets:sso:manage',
] as const;

/**
 * GET /api/auth/token
 * Returns tokens for WorkOS widgets
 * 
 * Query params:
 * - type=access: Returns the access token (5 min, for UserSessions)
 * - type=widget (default): Returns widget token (1 hour, for Profile/Security/Team)
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await getSession();

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const tokenType = searchParams.get('type') || 'widget';

    // For access token (used by UserSessions)
    if (tokenType === 'access') {
      return NextResponse.json({ 
        token: session.accessToken 
      });
    }

    // For widget token (used by Profile, Security, Team)
    const memberships = await workos.userManagement.listOrganizationMemberships({
      userId: session.user.id,
    });

    const firstMembership = memberships.data[0];
    if (!firstMembership) {
      return NextResponse.json(
        { error: 'No organization found' },
        { status: 400 }
      );
    }

    const token = await workos.widgets.getToken({
      userId: session.user.id,
      organizationId: firstMembership.organizationId,
      scopes: [...WIDGET_SCOPES],
    });

    return NextResponse.json({ token });
  } catch (error) {
    console.error('Error getting token:', error);
    return NextResponse.json(
      { error: 'Failed to get token' },
      { status: 500 }
    );
  }
}
