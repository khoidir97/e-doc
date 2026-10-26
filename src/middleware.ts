import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'e-doc-secret-key-change-this-in-production-123456'
);

const PUBLIC_ROUTES = ['/signin', '/signup'];
const STATIC_ASSET_REGEX = /\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?|map|json)$/i;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Bypass static files, images, next internals, and public auth API endpoints
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/favicon.ico') ||
    STATIC_ASSET_REGEX.test(pathname)
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get('token')?.value;

  let isAuthenticated = false;
  if (token) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      if (payload && payload.pgw_id) {
        isAuthenticated = true;
      }
    } catch {
      isAuthenticated = false;
    }
  }

  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // If user is NOT authenticated and trying to access any protected page -> Redirect to /signin
  if (!isAuthenticated && !isPublicRoute) {
    const loginUrl = new URL('/signin', request.url);
    const response = NextResponse.redirect(loginUrl);
    // If invalid/expired token exists, clear it
    if (token) {
      response.cookies.set('token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 0,
        expires: new Date(0),
      });
    }
    return response;
  }

  // If user IS authenticated and trying to access /signin or /signup -> Redirect to home (/)
  if (isAuthenticated && isPublicRoute) {
    const homeUrl = new URL('/', request.url);
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
