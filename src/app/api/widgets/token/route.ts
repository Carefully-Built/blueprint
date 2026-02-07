import { NextRequest, NextResponse } from 'next/server';

import { getSession } from '@/lib/session';
import { workos } from '@/lib/workos';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { scopes, organizationId } = await request.json();

    if (!scopes || !Array.isArray(scopes)) {
      return NextResponse.json({ error: 'Scopes required' }, { status: 400 });
    }

    const token = await workos.widgets.getToken({
      userId: session.user.id,
      organizationId,
      scopes,
    });

    return NextResponse.json({ token });
  } catch (error) {
    console.error('Error getting widget token:', error);
    return NextResponse.json({ error: 'Failed to get widget token' }, { status: 500 });
  }
}
