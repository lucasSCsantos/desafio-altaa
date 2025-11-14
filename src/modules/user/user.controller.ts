import { NextResponse } from 'next/server';
import { createUser, loginUser } from './user.service';
import { createUserSchema, loginUserSchema } from './user.schema';
import { ZodRealError } from 'zod';

export async function signupController(req: Request) {
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
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}

export async function loginController(req: Request) {
  try {
    const body = await req.json();

    const parsed = loginUserSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const token = await loginUser(parsed.data);

    return NextResponse.json(token);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}
