// scripts/db/migrate-neon.ts
import { config } from 'dotenv'
config({ path: '.env.local' }) // 👈 fuerza .env.local
import type { NeonSql } from '@neondatabase/serverless'
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'

async function main() {
  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error('Falta DATABASE_URL en .env.local')
  }

  const sql = neon(url) as NeonSql           // tagged template client
  const db = drizzle(sql, { logger: true })

  await migrate(db, { migrationsFolder: 'drizzle' })
  console.log('✅ Migraciones aplicadas')
}

main().catch((err) => {
  console.error('❌ Error migrando:', err)
  process.exit(1)
})
