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
const connectionString =
  process.env.SUPABASE_DB_URL ||
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL ||
  // fallbacks for local/dev .env that uses cxz_ prefixes
  process.env.cxz_POSTGRES_URL ||
  process.env.cxz_POSTGRES_PRISMA_URL ||
  process.env.cxz_POSTGRES_URL_NON_POOLING ||
  '';

if (!connectionString) {
  throw new Error(
    'No se encontró URL de base de datos. Define SUPABASE_DB_URL, POSTGRES_URL o DATABASE_URL en las variables de entorno.'
  );
}

// Try to use @supabase/postgres-js for serverless-friendly connections when available.
// If it's not installed or fails, fall back to the 'postgres' client.
let lowLevelClient: any;
try {
  // Dynamic require so code still works if package not installed at runtime.
  // Use eval('require') to avoid static analysis by bundlers that would
  // attempt to resolve the module during client-side bundling.
  let supabasePg: any;
  try {
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    const req = eval('require');
    supabasePg = req('@supabase/postgres-js');
  } catch {
    // leave supabasePg undefined — we'll fallback below
  }
  if (supabasePg && typeof supabasePg.createClient === 'function') {
    // The package exposes createClient(connectionString) in most versions
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    lowLevelClient = supabasePg.createClient(connectionString);
  }
} catch {
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

