import { NextRequest, NextResponse } from 'next/server';

import { getSession } from '@/lib/session';
import { workos } from '@/lib/workos';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: organizationId } = await params;
    const { email, role = 'member' } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Send invitation via WorkOS
    const invitation = await workos.userManagement.sendInvitation({
      email,
      organizationId,
      inviterUserId: session.user.id,
      roleSlug: role,
    });

    return NextResponse.json({ 
      success: true, 
      invitation: {
        id: invitation.id,
        email: invitation.email,
        state: invitation.state,
      }
    });
  } catch (error: any) {
    console.error('Error sending invitation:', error);
    
    // Handle specific WorkOS errors
    if (error.message?.includes('already')) {
      return NextResponse.json({ error: 'User is already a member' }, { status: 400 });
    }
    
    return NextResponse.json({ error: 'Failed to send invitation' }, { status: 500 });
  }
}
