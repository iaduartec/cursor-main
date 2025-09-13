/**
Resumen generado automáticamente.

app/api/db-ping/route.ts

2025-09-13T06:20:07.360Z

——————————————————————————————
Archivo .ts: route.ts
Tamaño: 506 caracteres, 14 líneas
Resumen básico generado automáticamente sin análisis de IA.
Contenido detectado basado en extensión y estructura básica.
*/
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { sql } from '../../../db/client'

export async function GET(req: NextRequest) {
  try {
    // Drizzle client exposes a low-level SQL client as `sql` in this repo
    const rows = await sql`select version() as version limit 1`
    return NextResponse.json({ ok: true, version: rows })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}

