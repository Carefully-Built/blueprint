import { NextRequest, NextResponse } from 'next/server';

import { getSession } from '@/lib/session';
import { workos } from '@/lib/workos';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: organizationId } = await params;

    // Get organization memberships
    const memberships = await workos.userManagement.listOrganizationMemberships({
      organizationId,
    });

    // Get user details for each membership
    const members = await Promise.all(
      memberships.data.map(async (membership) => {
        try {
          const user = await workos.userManagement.getUser(membership.userId);
          return {
            id: membership.id,
            userId: user.id,
            email: user.email,
            name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || undefined,
            role: membership.role?.slug || 'member',
            imageUrl: user.profilePictureUrl,
          };
        } catch {
          return null;
        }
      })
    );

    return NextResponse.json({ 
      members: members.filter(Boolean) 
    });
  } catch (error) {
    console.error('Error fetching members:', error);
    return NextResponse.json({ error: 'Failed to fetch members' }, { status: 500 });
  }
}
