import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'supersecret');
      await jwtVerify(token, secret);
      return NextResponse.next();
    } catch (e) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  if (pathname.startsWith('/api/articles') && request.method !== 'GET') {
      const token = request.cookies.get('admin_token')?.value;
      if (!token) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      try {
          const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'supersecret');
          await jwtVerify(token, secret);
      } catch (e) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/articles/:path*', '/api/banners/:path*'],
};
