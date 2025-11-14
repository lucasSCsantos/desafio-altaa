import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/auth';
import { acceptInvite, createInvite } from './invite.service';
import { acceptInviteSchema, createInviteSchema } from './invite.schema';
import { cookies } from 'next/headers';

export async function createInviteController(req: NextRequest) {
  try {
    const token = (await cookies()).get('session')?.value;
    const session = verifyJWT(token);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();

    const parsed = createInviteSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const invite = await createInvite(parsed.data, session);
    return NextResponse.json(invite);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create company' }, { status: 500 });
  }
}

export async function acceptInviteController(req: NextRequest) {
  try {
    const token = (await cookies()).get('session')?.value;
    const session = verifyJWT(token);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const inviteToken = req.nextUrl.searchParams.get('token');

    if (inviteToken == null) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    const accepted = await acceptInvite(inviteToken, session);

    return NextResponse.json(accepted);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to accept invite' }, { status: 500 });
  }
}
