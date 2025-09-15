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
import { createClient } from '@supabase/supabase-js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Prefer Supabase-specific env vars when deploying to Vercel/Supabase
// Order of precedence:
// 1. SUPABASE_DB_URL (recommended for Supabase projects)
// 2. POSTGRES_URL (used in this repo scripts)
// 3. DATABASE_URL (generic)
// Support legacy/local env var names (some environments use cxz_ prefix).
const rawConnectionString =
  process.env.SUPABASE_DB_URL ||
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL ||
  // fallbacks for local/dev .env that uses cxz_ prefixes
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
  // Try to use @supabase/postgres-js for serverless-friendly connections when available.
  // If it's not installed or fails, fall back to the 'postgres' client.
  let lowLevelClient: unknown;
  try {
    // Dynamic require so code still works if package not installed at runtime.
    const req = eval('require');
    const supabasePg = (() => {
      try { return req('@supabase/postgres-js'); } catch { return undefined; }
    })();
    if (supabasePg && typeof supabasePg.createClient === 'function') {
      lowLevelClient = supabasePg.createClient(connectionString);
    }
  } catch {
    // ignore; we'll fallback to the 'postgres' client below
  }

  // If @supabase/postgres-js was available and created a client, use it.
  // Otherwise create a client with the 'postgres' package.
  client = lowLevelClient ?? postgres(connectionString, { prepare: false });

  dbExport = drizzle(client as any, { schema });
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

// The exports are typed as `any` intentionally to avoid cascading type errors
// during the incremental migration. We'll tighten these later.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const db: any = dbExport;

// Export the low-level sql client too (may be undefined when DB is skipped)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sql: any = client as any;

// Supabase client (JS) for auth/storage/other APIs. Prefer using
// SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_ANON_KEY) set in Vercel.
// Accept cxz_ prefixed env vars commonly used in local .env files as fallbacks
const supabaseUrl = process.env.SUPABASE_URL || process.env.cxz_SUPABASE_URL || process.env.cxz_NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.cxz_SUPABASE_SERVICE_ROLE_KEY ||
  process.env.cxz_NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  '';

if (!supabaseUrl || !supabaseKey) {
  // Don't crash - some environments may not need the JS client. Log a helpful warning.
  // In Vercel, set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY as environment variables.
  // If you only need DB access via Drizzle, the SUPABASE_* JS client is optional.
   
  console.warn(
    'Advertencia: SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY/SUPABASE_ANON_KEY no definidos. Algunas funcionalidades de Supabase (auth/storage) podrían no funcionar.'
  );
}

export const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  : undefined;

