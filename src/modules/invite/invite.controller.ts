import { NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/auth';
import { acceptInvite, createInvite } from './invite.service';
import { acceptInviteSchema, createInviteSchema } from './invite.schema';

export async function createInviteController(req: Request) {
  try {
    const token = req.headers.get('cookie')?.split('session=')[1];
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

export async function acceptInviteController(req: Request) {
  try {
    const token = req.headers.get('cookie')?.split('session=')[1];
    const session = verifyJWT(token);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();

    const parsed = acceptInviteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const companies = await acceptInvite(parsed.data, session);
    return NextResponse.json(companies);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch companies' }, { status: 500 });
  }
}
