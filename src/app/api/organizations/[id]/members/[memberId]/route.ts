import { NextRequest, NextResponse } from 'next/server';

import { getSession } from '@/lib/session';
import { workos } from '@/lib/workos';

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; memberId: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { memberId } = await params;

    // Delete organization membership
    await workos.userManagement.deleteOrganizationMembership(memberId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing member:', error);
    return NextResponse.json({ error: 'Failed to remove member' }, { status: 500 });
  }
}
