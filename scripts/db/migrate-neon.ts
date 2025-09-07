// scripts/db/migrate-neon.ts
/* eslint-disable no-console */
import { config as loadEnv } from 'dotenv';
import { resolve } from 'node:path';
loadEnv({ path: resolve(process.cwd(), '.env.local') });
loadEnv({ path: resolve(process.cwd(), '.env') });

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { migrate } from 'drizzle-orm/neon-http/migrator';

async function main() {
  const url =
    process.env.DATABASE_URL ||
    process.env.NEON_DATABASE_URL ||
    process.env.DATABASE_URL_PREVIEW;

  if (!url) {
    throw new Error('DATABASE_URL no definida');
  }

  const sql = neon(url);
  const db = drizzle(sql);
  await migrate(db, { migrationsFolder: 'drizzle' });
  console.log('✅ Migraciones aplicadas');
}

main().catch((e) => {
  console.error('❌ Error migrando:', e);
  process.exit(1);
});
