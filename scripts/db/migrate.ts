/**
 * scripts/db/migrate.ts
 * Script de migración para base de datos Postgres (Neon/Vercel)
 * Compatible con cualquier proveedor Postgres
 */
import { config } from 'dotenv';
// Intentar .env.local primero, luego .env
config({ path: '.env.local' });
config({ path: '.env' });

import { neon, type NeonSql } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';

async function main() {
  const url = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  if (!url) {
    console.warn(
      '⚠️  No POSTGRES_URL or DATABASE_URL found in environment variables — skipping DB migrations'
    );
    return;
  }

  console.log('🚀 Conectando a la base de datos...');
  const sql = neon(url) as NeonSql;
  const db = drizzle(sql, { logger: true });

  console.log('📦 Aplicando migraciones...');
  await migrate(db, { migrationsFolder: 'drizzle' });
  console.log('✅ Migraciones aplicadas exitosamente');

  if (typeof sql.end === 'function') {
    await sql.end();
  }
}

main().catch(err => {
  console.error('❌ Error migrando:', err);
  process.exit(1);
});
