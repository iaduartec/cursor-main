/**
Resumen generado automáticamente.

scripts/db/ping-neon.ts

2025-09-13T06:20:07.385Z

——————————————————————————————
Archivo .ts: ping-neon.ts
Tamaño: 326 caracteres, 12 líneas
Resumen básico generado automáticamente sin análisis de IA.
Contenido detectado basado en extensión y estructura básica.
*/
import { config } from 'dotenv'
config({ path: '.env.local' })

import { neon } from '@neondatabase/serverless'

async function main() {
  const sql = neon(process.env.DATABASE_URL!)
  const rows = await sql`select now() as now, version() as v`
  console.log(rows)
}
main().catch((e) => { console.error(e); process.exit(1) })
