import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Only protect specific admin sub-routes, not /admin itself (login page)
  const protectedAdminRoutes = ['/admin/posts', '/admin/services', '/admin/projects', '/admin/stats'];
  const isProtectedRoute = protectedAdminRoutes.some(route => pathname.startsWith(route));
  
  if (isProtectedRoute) {
    const token = request.cookies.get('admin-token')?.value;
    
    if (!token) {
      console.log('[Middleware] No token found, redirecting to login');
      return NextResponse.redirect(new URL('/admin', request.url));
    }

    try {
      const tokenData = JSON.parse(Buffer.from(token, 'base64').toString());
      
      if (Date.now() > tokenData.expires) {
        console.log('[Middleware] Token expired, redirecting to login');
        const response = NextResponse.redirect(new URL('/admin', request.url));
        response.cookies.delete('admin-token');
        return response;
      }

      if (!tokenData.isAdmin || tokenData.userId !== 'admin') {
        console.log('[Middleware] Invalid token, redirecting to login');
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      
      console.log('[Middleware] Token valid, allowing access to:', pathname);
    } catch (error) {
      console.log('[Middleware] Token parsing error, redirecting to login');
      const response = NextResponse.redirect(new URL('/admin', request.url));
      response.cookies.delete('admin-token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/posts/:path*',
    '/admin/services/:path*', 
    '/admin/projects/:path*',
    '/admin/stats/:path*'
  ],
};
