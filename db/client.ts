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

