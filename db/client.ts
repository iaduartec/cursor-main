/**
Resumen generado automáticamente.

db/client.ts

2025-09-13T06:20:07.370Z

——————————————————————————————
Archivo .ts: client.ts
Tamaño: 3569 caracteres, 88 líneas
Resumen básico generado automáticamente sin análisis de IA.
Contenido detectado basado en extensión y estructura básica.
*/
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import type { PgDatabase } from 'drizzle-orm/pg-core';

// Connection string precedence: POSTGRES_URL > DATABASE_URL
// Keep support for legacy cxz_ prefixed env vars used in local .env files.
const rawConnectionString =
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL ||
  process.env.cxz_POSTGRES_URL ||
  process.env.cxz_POSTGRES_PRISMA_URL ||
  process.env.cxz_POSTGRES_URL_NON_POOLING ||
  '';

// Trim accidental surrounding quotes which sometimes appear when env vars
// are injected with quotes (e.g. '"postgres://..."'). This prevents
// URL parsing errors like ERR_INVALID_URL.
const connectionString = rawConnectionString.replace(/^"|"$/g, '').trim();

const skipDb = process.env.USE_IN_MEMORY_DB === '1' || process.env.SKIP_DB === '1';

if (!connectionString) {
  throw new Error(
    'No se encontró URL de base de datos. Define SUPABASE_DB_URL, POSTGRES_URL o DATABASE_URL en las variables de entorno.'
  );
}

// If the environment requested skipping DB access, export a lightweight
// fake `db` that behaves like a thenable query returning empty results.
// This avoids runtime errors during static generation while keeping the
// import surface stable.
let client: unknown = undefined;
let dbExport: unknown = undefined;
if (!skipDb) {
  // Use the 'postgres' client (Neon-friendly) as the single supported
  // low-level driver. This repo now uses Neon exclusively so we simplify
  // the runtime path and remove any Supabase-specific branches.
  client = postgres(connectionString, { prepare: false });

  // Create a typed Drizzle instance using the Neon/postgres client.
  dbExport = drizzle(client as unknown as import('postgres').Sql, { schema });
} else {
  // Minimal thenable query used as a chainable stub. When awaited it resolves
  // to an empty array. This covers typical usage patterns like
  // `await db.select(...).from(...).where(...);` and count queries.
  class FakeQuery {
    from() { return this; }
    where() { return this; }
    orderBy() { return this; }
    limit() { return this; }
    offset() { return this; }
    groupBy() { return this; }
    then(onfulfilled?: (value: unknown) => unknown): Promise<unknown> {
      if (typeof onfulfilled === 'function') {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        try { onfulfilled([] as unknown); } catch (_ignored) { /* ignore */ }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        try { onfulfilled([] as unknown); } catch (_ignored2) { /* ignore */ }
      }
      return Promise.resolve([] as unknown);
    }
  }

  const fakeDb = {
    select: () => new FakeQuery(),
    // count-like queries expect an array with value field; return empty array.
  };

  dbExport = fakeDb;
}

// The exports use `unknown` for now to avoid cascading type errors while
// we incrementally migrate to precise Drizzle/Supabase types. Replacing
// `any` with `unknown` keeps the import surface safe and removes the
// `no-explicit-any` lint noise; we'll tighten these to concrete types
// in a follow-up PR once callers are updated.
// Temporary: export as `any` to avoid cascading type errors across the
// codebase while we perform an incremental typing migration. This keeps
// the runtime behavior unchanged. We'll replace these `any` exports with
// concrete Drizzle/Supabase types in a follow-up PR.
// Export a typed Drizzle client using the schema. We cast the runtime
// value (`dbExport`) to the Drizzle type to incrementally tighten types
// without changing runtime behavior.
export type DrizzleClient = PgDatabase<any, schema.Database>;
// Export db as Drizzle<Database> so callers can gradually adopt the
// concrete schema types. The runtime value is unchanged (dbExport) but the
// exported type is now stricter which helps downstream migrations.
export const db = dbExport as unknown as DrizzleClient;
// Low-level template-tag SQL client type. This matches the minimal surface
// used across the codebase: callable as a template tag and exposing optional
// helpers like `.end()` and a debug `__state` field (in-memory adapter).
export type SqlTag = ((strings: TemplateStringsArray, ...values: unknown[]) => Promise<unknown>) & {
  end?: () => Promise<unknown>;
  __state?: unknown;
};

// Export the low-level sql client with a narrow callable type to allow usages
// like `await sql` and `await sql` template-tag calls to type-check. The
// runtime value is unchanged; we avoid `any` by using a small adapter type.
export const sql: SqlTag = (client as unknown) as SqlTag;

