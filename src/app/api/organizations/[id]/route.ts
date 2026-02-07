import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

import { getSession } from '@/lib/session';
import { workos } from '@/lib/workos';

interface UpdateOrgBody {
  name: string;
}

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: RouteParams): Promise<NextResponse> {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = (await request.json()) as UpdateOrgBody;

    const org = await workos.organizations.updateOrganization({
      organization: id,
      name: body.name,
    });

    return NextResponse.json({ success: true, organization: org });
  } catch (err) {
    console.error('Error updating organization:', err);
    return NextResponse.json({ error: 'Failed to update organization' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams): Promise<NextResponse> {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    await workos.organizations.deleteOrganization(id);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error deleting organization:', err);
    return NextResponse.json({ error: 'Failed to delete organization' }, { status: 500 });
  }
}
