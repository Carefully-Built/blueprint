import { NextResponse } from 'next/server';

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
 * Returns a fresh widget token (1-hour expiry) for WorkOS widgets
 */
export async function GET(): Promise<NextResponse> {
  try {
    const session = await getSession();

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get user's organization
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

    // Generate widget token with all necessary scopes
    const token = await workos.widgets.getToken({
      userId: session.user.id,
      organizationId: firstMembership.organizationId,
      scopes: [...WIDGET_SCOPES],
    });

    return NextResponse.json({ token });
  } catch (error) {
    console.error('Error getting widget token:', error);
    return NextResponse.json(
      { error: 'Failed to get token' },
      { status: 500 }
    );
  }
}
