/**
Resumen generado automáticamente.

app/api/admin/login/route.ts

2025-09-13T06:20:07.360Z

——————————————————————————————
Archivo .ts: route.ts
Tamaño: 544 caracteres, 15 líneas
Resumen básico generado automáticamente sin análisis de IA.
Contenido detectado basado en extensión y estructura básica.
*/
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const token = String(form.get('token') || '');
  const expected = process.env.ADMIN_TOKEN || '';
  if (expected && token === expected) {
    const res = NextResponse.redirect(new URL('/admin', req.url));
    res.cookies.set('admin', token, { httpOnly: true, sameSite: 'lax', secure: true, path: '/' });
    return res;
  }
  return NextResponse.redirect(new URL('/admin/login?error=1', req.url));
}

