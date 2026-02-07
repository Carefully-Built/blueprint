import { NextResponse } from 'next/server';

import { WORKOS_CLIENT_ID } from '@/lib/workos';

export function GET(): NextResponse {
  try {
    // Test if WorkOS credentials are valid
    const isValid = !!WORKOS_CLIENT_ID && !!process.env.WORKOS_API_KEY;

    return NextResponse.json({
      credentialsSet: isValid,
      clientId: WORKOS_CLIENT_ID?.substring(0, 20) + '...',
      message: isValid
        ? 'Credentials are set. Try creating a user!'
        : 'Please set real WorkOS credentials in .env',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({
      error: message,
      message: 'Invalid WorkOS configuration',
    });
  }
}
