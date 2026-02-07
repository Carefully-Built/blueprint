import { NextResponse } from 'next/server';

import { getSession } from '@/lib/session';

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }
    return NextResponse.json({ user: session.user });
  } catch (error) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
