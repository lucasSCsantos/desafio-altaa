import { type NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from './lib/auth';

const publicRoutes = ['/login', '/signup'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const publicRoute = publicRoutes.includes(pathname);
  const token = request.cookies.get('session')?.value || null;

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
