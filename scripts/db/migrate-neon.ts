/**
Resumen generado automáticamente.

scripts/db/migrate-neon.ts

2025-09-13T06:20:07.384Z

——————————————————————————————
Archivo .ts: migrate-neon.ts
Tamaño: 697 caracteres, 24 líneas
Resumen básico generado automáticamente sin análisis de IA.
Contenido detectado basado en extensión y estructura básica.
*/
// scripts/db/migrate-neon.ts
import { config } from 'dotenv'
config({ path: '.env.local' }) // 👈 fuerza .env.local
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { migrate } from 'drizzle-orm/neon-http/migrator'

async function main() {
  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error('Falta DATABASE_URL en .env.local')
  }

  const sql = neon(url)           // tagged template client
  const db = drizzle(sql, { logger: true })

  await migrate(db, { migrationsFolder: 'drizzle' })
  console.log('✅ Migraciones aplicadas')
}

main().catch((err) => {
  console.error('❌ Error migrando:', err)
  process.exit(1)
})