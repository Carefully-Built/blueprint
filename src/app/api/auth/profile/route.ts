import { NextRequest, NextResponse } from 'next/server';

import { getSession, createSession } from '@/lib/session';
import { workos } from '@/lib/workos';

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { firstName, lastName } = await request.json();

    // Update user in WorkOS
    const updatedUser = await workos.userManagement.updateUser({
      userId: session.user.id,
      firstName,
      lastName,
    });

    // Update session with new user data
    await createSession({
      user: updatedUser,
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
