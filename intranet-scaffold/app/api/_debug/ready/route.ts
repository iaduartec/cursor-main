/**
Resumen generado automáticamente.

intranet-scaffold/app/api/_debug/ready/route.ts

2025-09-13T06:20:07.373Z

——————————————————————————————
Archivo .ts: route.ts
Tamaño: 1021 caracteres, 34 líneas
Resumen básico generado automáticamente sin análisis de IA.
Contenido detectado basado en extensión y estructura básica.
*/
import { NextResponse } from 'next/server';
import { getDb } from '../../../../lib/db';

function checkDebugAccess(req: Request) {
  const token = process.env.INTRANET_DEBUG_TOKEN;
  if (token) {
    const provided = req.headers.get('x-debug-token') || '';
    if (provided !== token) return false;
    return true;
  }
  if (process.env.NODE_ENV === 'production') return false;
  return true;
}

export async function GET(req: Request) {
  if (!checkDebugAccess(req)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  try {
    try {
      const sql = getDb();
      if (sql && (sql as any).__state) {
        return NextResponse.json({ ready: true });
      }
      const res = await sql`SELECT 1`;
      return NextResponse.json({ ready: true, result: res });
    } catch (e) {
      return NextResponse.json({ ready: false, error: String(e) }, { status: 503 });
    }
  } catch (err: any) {
    return NextResponse.json({ error: String(err) || 'Internal Error' }, { status: 500 });
  }
}
