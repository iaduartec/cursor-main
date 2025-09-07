import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith('/admin')) {
    if (pathname.startsWith('/admin/login')) return NextResponse.next();
    const token = req.cookies.get('admin')?.value || '';
    const expected = process.env.ADMIN_TOKEN || '';
    if (!expected || token !== expected) {
      const url = new URL('/admin/login', req.url);
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};

