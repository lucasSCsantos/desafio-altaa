import { type NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from './lib/auth';

const publicRoutes = ['/login', '/signup'];
const developmentRoutes = ['/docs'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const publicRoute = publicRoutes.includes(pathname);
  const token = request.cookies.get('session')?.value || null;

  if (developmentRoutes.includes(pathname) && process.env.NODE_ENV === 'development') {
    return NextResponse.next();
  }

  if (!token && pathname === '/accept-invite') {
    const tokenParam = request.nextUrl.searchParams.get('token') || '';
    const redirectUrl = new URL(`/login?token=${tokenParam}`, request.nextUrl);
    redirectUrl.searchParams.set('error', 'session_required');
    return NextResponse.redirect(redirectUrl);
  }

  if (!token && publicRoute) {
    return NextResponse.next();
  }

  if (!token && !publicRoute) {
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }

  if (token && publicRoute) {
    return NextResponse.redirect(new URL('/', request.nextUrl));
  }

  if (token && !publicRoute) {
    const session = verifyJWT(token);

    if (!session) {
      return NextResponse.redirect(new URL('/login', request.nextUrl));
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. all root files inside /public (e.g. /favicon.ico)
     */
    '/((?!api|_next|[\\w-]+\\.\\w+).*)',
  ],
};
