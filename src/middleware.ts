import { unsealData } from 'iron-session';
import { NextResponse } from 'next/server';

import type { SessionData } from './lib/session';
import type { NextRequest } from 'next/server';

// Paths that don't require authentication
const PUBLIC_PATHS = [
  '/',
  '/sign-in',
  '/sign-up',
  '/forgot-password',
  '/api/auth',
  '/api/test-workos',
];

async function getSessionFromRequest(
  request: NextRequest
): Promise<SessionData | null> {
  const sessionCookie = request.cookies.get('session');

  if (!sessionCookie?.value) {
    return null;
  }

  try {
    const session = await unsealData<SessionData>(sessionCookie.value, {
      password: process.env.WORKOS_COOKIE_PASSWORD!,
    });
    return session;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Check if user is authenticated
  const session = await getSessionFromRequest(request);

  if (!session) {
    // Redirect to sign-in if not authenticated
    const url = new URL('/sign-in', request.url);
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|api/webhooks).*)',
  ],
};
