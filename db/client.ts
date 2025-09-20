import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Prefer Supabase-specific env vars when deploying to Vercel/Supabase
// Order of precedence:
// 1. SUPABASE_DB_URL (recommended for Supabase projects)
// 2. POSTGRES_URL (used in this repo scripts)
// 3. DATABASE_URL (generic)
const connectionString =
  process.env.SUPABASE_DB_URL || process.env.POSTGRES_URL || process.env.DATABASE_URL || '';

if (!connectionString) {
  throw new Error(
    'No se encontró URL de base de datos. Define SUPABASE_DB_URL, POSTGRES_URL o DATABASE_URL en las variables de entorno.'
  );
}

// Create postgres client for Drizzle using the existing 'postgres' driver.
// Note: For serverless environments (Vercel), consider switching to
// '@supabase/postgres-js' or other serverless-friendly drivers for improved
// connection handling. Keeping 'postgres' for now to avoid adding deps.
const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client, { schema });

// Export the low-level sql client too
export { client as sql };

// Supabase client (JS) for auth/storage/other APIs. Prefer using
// SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_ANON_KEY) set in Vercel.
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  // Don't crash - some environments may not need the JS client. Log a helpful warning.
  // In Vercel, set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY as environment variables.
  // If you only need DB access via Drizzle, the SUPABASE_* JS client is optional.
  // eslint-disable-next-line no-console
  console.warn(
    'Advertencia: SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY/SUPABASE_ANON_KEY no definidos. Algunas funcionalidades de Supabase (auth/storage) podrían no funcionar.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Database connection configuration
// Order of precedence:
// 1. POSTGRES_URL (recommended for Neon/Postgres projects)
// 2. DATABASE_URL (generic fallback)
const rawConnectionString =
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

let skipDb =
  process.env.USE_IN_MEMORY_DB === '1' ||
  process.env.SKIP_DB === '1' ||
  !connectionString; // Skip if no connection string available

if (!connectionString) {
  console.warn(
    '⚠️  No se encontró URL de base de datos. Usando modo sin conexión.'
  );
}

// If the environment requested skipping DB access, export a lightweight
// fake `db` that behaves like a thenable query returning empty results.
// This avoids runtime errors during static generation while keeping the
// import surface stable.
let client: postgres.Sql | undefined = undefined;
let dbExport: unknown = undefined;
if (!skipDb) {
  try {
    // Create client with the 'postgres' package
    client = postgres(connectionString, { prepare: false });

    // Test the connection to ensure it's working
    await client`SELECT 1`;

    dbExport = drizzle(client, { schema });
  } catch (error) {
    console.warn(
      '⚠️  Error conectando a la base de datos:',
      (error as Error).message
    );
    console.warn('⚠️  Usando modo sin conexión para evitar errores de build.');
    skipDb = true;
  }
} else {
  // Minimal thenable query used as a chainable stub. When awaited it resolves
  // to an empty array. This covers typical usage patterns like
  // `await db.select(...).from(...).where(...);` and count queries.
  class FakeQuery {
    from() {
      return this;
    }
    where() {
      return this;
    }
    orderBy() {
      return this;
    }
    limit() {
      return this;
    }
    offset() {
      return this;
    }
    groupBy() {
      return this;
    }
    then(onfulfilled?: (value: unknown) => unknown): Promise<unknown> {
      if (typeof onfulfilled === 'function') {
        try {
          onfulfilled([] as unknown);
        } catch {
          /* ignore */
        }
        try {
          onfulfilled([] as unknown);
        } catch {
          /* ignore */
        }
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

export const db = dbExport;

// Export the low-level sql client too (may be undefined when DB is skipped)
export { client as sql };
