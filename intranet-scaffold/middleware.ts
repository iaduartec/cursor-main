import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Proteger rutas de admin
  if (pathname.startsWith('/admin')) {
    // Verificar si hay un token válido
    const token = request.cookies.get('intranet_token')?.value;
    const expectedToken =
      process.env.INTRANET_DEBUG_TOKEN || process.env.ADMIN_TOKEN;

    if (!token || token !== expectedToken) {
      // Redirigir al login si no está autenticado
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
