import { NextResponse } from 'next/server';

import { getSession } from '@/lib/session';

/**
 * GET /api/auth/token
 * Returns a fresh access token for WorkOS widgets
 */
export async function GET(): Promise<NextResponse> {
  try {
    const session = await getSession();

    if (!session?.accessToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    return NextResponse.json({ 
      accessToken: session.accessToken 
    });
  } catch (error) {
    console.error('Error getting access token:', error);
    return NextResponse.json(
      { error: 'Failed to get token' },
      { status: 500 }
    );
  }
}
