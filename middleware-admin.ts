import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Protect all /admin routes except /admin (login page)
  if (request.nextUrl.pathname.startsWith('/admin/') || 
      (request.nextUrl.pathname === '/admin' && request.nextUrl.search)) {
    
    const token = request.cookies.get('admin-token')?.value;
    
    if (!token) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }

    try {
      const tokenData = JSON.parse(Buffer.from(token, 'base64').toString());
      
      if (Date.now() > tokenData.expires) {
        const response = NextResponse.redirect(new URL('/admin', request.url));
        response.cookies.delete('admin-token');
        return response;
      }

      if (!tokenData.isAdmin || tokenData.userId !== 'admin') {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
    } catch {
      const response = NextResponse.redirect(new URL('/admin', request.url));
      response.cookies.delete('admin-token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*'
  ]
};