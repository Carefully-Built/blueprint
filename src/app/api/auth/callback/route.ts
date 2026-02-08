import { NextResponse } from 'next/server';

import type { NextRequest} from 'next/server';

import { syncUserToConvex } from '@/lib/convex-server';
import { createSession } from '@/lib/session';
import { WORKOS_CLIENT_ID, workos } from '@/lib/workos';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=no_code', request.url));
  }

  try {
    const { user, accessToken, refreshToken } = await workos.userManagement.authenticateWithCode({
      clientId: WORKOS_CLIENT_ID,
      code,
    });

    await syncUserToConvex(user);

    await createSession({
      user,
      accessToken,
      refreshToken,
    });

    return NextResponse.redirect(new URL('/dashboard', request.url));
  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(new URL('/login?error=auth_failed', request.url));
  }
}
