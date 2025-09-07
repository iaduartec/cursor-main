/* eslint-disable no-console */

import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { migrate } from 'drizzle-orm/neon-http/migrator';

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL no definida');
  }

  const sql = neon(url);           // cliente Neon
  const db = drizzle(sql);         // Drizzle con adaptador neon-http

  await migrate(db, { migrationsFolder: 'drizzle' });
  console.log('✅ Migraciones aplicadas');
}

main().catch((err) => {
  console.error('❌ Error migrando:', err);
  process.exit(1);
});
