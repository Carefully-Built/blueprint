import { NextResponse } from 'next/server';

import type { NextRequest} from 'next/server';

import { syncUserToConvex } from '@/lib/convex-server';
import { getSession } from '@/lib/session';
import { workos } from '@/lib/workos';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name } = await request.json();

    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Organization name required' }, { status: 400 });
    }

    // Create organization in WorkOS
    const org = await workos.organizations.createOrganization({
      name: name.trim(),
    });

    // Add the current user as a member of the organization
    await workos.userManagement.createOrganizationMembership({
      userId: session.user.id,
      organizationId: org.id,
      roleSlug: 'admin', // Creator becomes admin
    });

    // Update user in Convex with the new organization
    await syncUserToConvex({
      id: session.user.id,
      email: session.user.email,
      firstName: session.user.firstName,
      lastName: session.user.lastName,
      profilePictureUrl: session.user.profilePictureUrl,
    });

    return NextResponse.json({ 
      success: true, 
      organizationId: org.id,
      organization: {
        id: org.id,
        name: org.name,
      }
    });
  } catch (error) {
    console.error('Error creating organization:', error);
    return NextResponse.json({ error: 'Failed to create organization' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all organizations the user belongs to
    const memberships = await workos.userManagement.listOrganizationMemberships({
      userId: session.user.id,
    });

    const organizations = await Promise.all(
      memberships.data.map(async (membership) => {
        const org = await workos.organizations.getOrganization(membership.organizationId);
        return {
          id: org.id,
          name: org.name,
          role: membership.role?.slug || 'member',
        };
      })
    );

    return NextResponse.json({ organizations });
  } catch (error) {
    console.error('Error listing organizations:', error);
    return NextResponse.json({ error: 'Failed to list organizations' }, { status: 500 });
  }
}
