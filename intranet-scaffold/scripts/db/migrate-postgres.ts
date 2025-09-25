#!/usr/bin/env tsx
/**
Database migration script for Postgres/Neon using Drizzle ORM.

intranet-scaffold/scripts/db/migrate-postgres.ts

Updated: 2025-09-25 - Removed Supabase dependencies

——————————————————————————————
Archivo .ts: migrate-postgres.ts
Tamaño: 1439 caracteres, 43 líneas
Database migration script for PostgreSQL databases.
*/
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import postgres from 'postgres';

async function main() {
  // Use Neon/Postgres URL for database connections
  const databaseUrl =
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL ||
    process.env.cxz_POSTGRES_URL;
  if (!databaseUrl) {
    console.error(
      'No database URL found in environment. Set POSTGRES_URL or DATABASE_URL.'
    );
    process.exit(1);
  }

  const sql = postgres(databaseUrl, { ssl: 'require' });
  // try possible locations: inside intranet-scaffold or at repo root
  const candidate1 = path.resolve(
    process.cwd(),
    'intranet-scaffold',
    'drizzle',
    'migrations',
    '0001_init.sql'
  );
  const candidate2 = path.resolve(
    process.cwd(),
    'drizzle',
    'migrations',
    '0001_init.sql'
  );
  let migrationPath = '';
  if (fs.existsSync(candidate1)) {
    migrationPath = candidate1;
  } else if (fs.existsSync(candidate2)) {
    migrationPath = candidate2;
  } else {
    console.error('Migration SQL not found. Checked:', candidate1, candidate2);
    process.exit(1);
  }

  const sqlText = fs.readFileSync(migrationPath, 'utf8');
  console.log('Applying migration:', migrationPath);
  try {
    await sql.unsafe(sqlText);
    console.log('Migration applied successfully');
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  } finally {
    await sql.end({ timeout: 5 });
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
