import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/auth';
import { deleteMember, updateMemberRole } from './membership.service';
import { DeleteMemberBodySchema, UpdateRoleBodySchema } from '@/schemas/membership.schema';
import { cookies } from 'next/headers';
import { createErrorResponse } from '@/lib/error-handler';

export async function updateMemberRoleController(req: NextRequest) {
  try {
    const token = (await cookies()).get('session')?.value;
    const session = verifyJWT(token);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();

    const parsed = UpdateRoleBodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const company = await updateMemberRole(parsed.data, session);
    return NextResponse.json(company);
  } catch (error) {
    return createErrorResponse(error);
  }
}

export async function deleteMemberController(req: NextRequest) {
  try {
    const token = (await cookies()).get('session')?.value;
    const session = verifyJWT(token);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();

    const parsed = DeleteMemberBodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    await deleteMember(session, parsed.data);

    return NextResponse.json({ success: true });
  } catch (error) {
    return createErrorResponse(error);
  }
}
