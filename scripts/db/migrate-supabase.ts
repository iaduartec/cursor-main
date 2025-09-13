/**
Resumen generado automáticamente.

scripts/db/migrate-supabase.ts

2025-09-13T06:20:07.384Z

——————————————————————————————
Archivo .ts: migrate-supabase.ts
Tamaño: 750 caracteres, 26 líneas
Resumen básico generado automáticamente sin análisis de IA.
Contenido detectado basado en extensión y estructura básica.
*/
// scripts/db/migrate-supabase.ts
import { config } from 'dotenv'
config({ path: '.env.local' }) // 👈 fuerza .env.local
import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'

async function main() {
  const url = process.env.POSTGRES_URL || process.env.DATABASE_URL
  if (!url) {
    throw new Error('Falta POSTGRES_URL o DATABASE_URL en .env.local')
  }

  const sql = postgres(url, { prepare: false })
  const db = drizzle(sql, { logger: true })

  await migrate(db, { migrationsFolder: 'drizzle' })
  console.log('✅ Migraciones aplicadas a Supabase')

  await sql.end()
}

main().catch((err) => {
  console.error('❌ Error migrando:', err)
  process.exit(1)
})