import { NextResponse } from 'next/server';
import { createUser, getUser, loginUser } from './user.service';
import { CreateUserBodySchema, LoginUserBodySchema } from '@/schemas/user.schema';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/auth';
import { createErrorResponse } from '@/lib/error-handler';

export async function signupController(req: Request) {
  try {
    const body = await req.json();

    const parsed = CreateUserBodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }
    const token = await createUser(parsed.data);

    const response = NextResponse.json({ success: true });

    response.cookies.set('session', token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: process.env.NODE_ENV === 'production',
    });

    return response;
  } catch (error) {
    return createErrorResponse(error);
  }
}

export async function loginController(req: Request) {
  try {
    const body = await req.json();

    const parsed = LoginUserBodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const token = await loginUser(parsed.data);
    const res = NextResponse.json({ success: true });

    res.cookies.set('session', token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: process.env.NODE_ENV === 'production',
    });

    return res;
  } catch (error) {
    return createErrorResponse(error);
  }
}

export async function logoutController() {
  try {
    const res = NextResponse.json({ success: true });

    res.cookies.set('session', '', { path: '/', expires: new Date(0) });

    return res;
  } catch (error) {
    return createErrorResponse(error);
  }
}

export async function getActualUserController() {
  try {
    const token = (await cookies()).get('session')?.value;
    const session = verifyJWT(token);

    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await getUser(session);
    return NextResponse.json(user);
  } catch (error) {
    return createErrorResponse(error);
  }
}
