import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/auth';
import { acceptInvite, createInvite } from './invite.service';
import { CreateInviteBodySchema } from './invite.schema';
import { cookies } from 'next/headers';
import { createErrorResponse } from '@/lib/error-handler';

export async function createInviteController(req: NextRequest) {
  try {
    const token = (await cookies()).get('session')?.value;
    const session = verifyJWT(token);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();

    const parsed = CreateInviteBodySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const invite = await createInvite(parsed.data, session);
    return NextResponse.json(invite);
  } catch (error) {
    return createErrorResponse(error);
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
    return createErrorResponse(error);
  }
}
