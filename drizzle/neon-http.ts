<<<<<<< HEAD
=======
/**
Resumen generado automáticamente.

drizzle/neon-http.ts

2025-09-13T06:20:07.371Z

——————————————————————————————
Archivo .ts: neon-http.ts
Tamaño: 506 caracteres, 19 líneas
Resumen básico generado automáticamente sin análisis de IA.
Contenido detectado basado en extensión y estructura básica.
*/
>>>>>>> a825cc0035acea741d54a0676ee96e99ce5c9aa9
// scripts/db/migrate-neon.ts
import 'dotenv/config'
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { migrate } from 'drizzle-orm/neon-http/migrator'

async function main() {
  const sql = neon(process.env.DATABASE_URL!)
  const db = drizzle(sql, { logger: true })

  await migrate(db, { migrationsFolder: 'drizzle' })
<<<<<<< HEAD
  console.log('✅ Migraciones aplicadas')
=======
  console.warn('✅ Migraciones aplicadas')
>>>>>>> a825cc0035acea741d54a0676ee96e99ce5c9aa9
}

main().catch((err) => {
  console.error('❌ Error migrando:', err)
  process.exit(1)
})
