import { createClient } from '@supabase/supabase-js';
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

// Try to use @supabase/postgres-js for serverless-friendly connections when available.
// If it's not installed or fails, fall back to the 'postgres' client.
let lowLevelClient: any;
try {
  // Dynamic require so code still works if package not installed at runtime
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const supabasePg = require('@supabase/postgres-js');
  if (supabasePg && typeof supabasePg.createClient === 'function') {
    // The package exposes createClient(connectionString) in most versions
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    lowLevelClient = supabasePg.createClient(connectionString);
  }
} catch (e) {
  // ignore; we'll fallback to the 'postgres' client below
}

// If @supabase/postgres-js was available and created a client, use it.
// Otherwise create a client with the 'postgres' package.
const client = lowLevelClient ?? postgres(connectionString, { prepare: false });

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

export const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  : undefined;

