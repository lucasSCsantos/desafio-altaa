import { NextResponse } from 'next/server';
import { createUser, loginUser } from './user.service';
import { createUserSchema } from './user.schema';

export async function signup(req: Request) {
  try {
    const body = await req.json();

    const parsed = createUserSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const token = await createUser(parsed.data);
    return NextResponse.json(token);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create company' }, { status: 500 });
  }
}

export async function login(req: Request) {
  try {
    const body = await req.json();

    const parsed = createUserSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const token = await loginUser(parsed.data);

    return NextResponse.json(token);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create company' }, { status: 500 });
  }
}
