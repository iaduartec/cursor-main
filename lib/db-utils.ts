/**
Resumen generado automáticamente.

lib/db-utils.ts

2025-09-13T06:20:07.380Z

——————————————————————————————
Archivo .ts: db-utils.ts
Tamaño: 1932 caracteres, 50 líneas
Resumen básico generado automáticamente sin análisis de IA.
Contenido detectado basado en extensión y estructura básica.
*/
// `db` import removed - utilities use runtime detection and fallbacks via hasDb/withDb

// Detecta si hay configuración de base de datos disponible en el entorno.
// Soporta nombres estándar y también los prefijos `cxz_` usados en .env local.
export const hasDb = () => {
  // In development, avoid attempting DB connections unless explicitly enabled.
  // Set ENABLE_DB_IN_DEV=1 or FORCE_DB_CONNECT=1 to override in local dev.
  const isProd = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1' || Boolean(process.env.VERCEL_ENV);
  if (!isProd && process.env.ENABLE_DB_IN_DEV !== '1' && process.env.FORCE_DB_CONNECT !== '1') {
    return false;
  }

  return Boolean(
    process.env.SUPABASE_DB_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.DATABASE_URL ||
    process.env.cxz_POSTGRES_URL ||
    process.env.cxz_POSTGRES_PRISMA_URL ||
    process.env.cxz_POSTGRES_URL_NON_POOLING
  );
};

export async function withDb<T>(
  operation: () => Promise<T>,
  fallback: T
): Promise<T> {
  if (!hasDb()) {
    return fallback;
  }
  
  try {
    return await operation();
  } catch (error) {
    // Si es un error de red común (host no resuelto, DNS, etc.), emitir un warning conciso.
    const err = error as unknown;
    const r = err as Record<string, unknown> | null;
    const msg = r && typeof r.message === 'string' ? (r.message as string) : String(err);
    const causeCode = r && typeof r.code === 'string' ? (r.code as string) : undefined;
    const isNetworkError = /getaddrinfo|ENOTFOUND|EAI_AGAIN/i.test(msg) || causeCode === 'ENOTFOUND';
    // Build an enhanced hint including query/params when available (Drizzle errors include them)
    const query = r && typeof r.query === 'string' ? (r.query as string) : undefined;
    const params = r && Array.isArray(r.params) ? (r.params as unknown[]) : undefined;

    if (isNetworkError) {
      console.warn('Database unavailable (network error). Falling back to contentlayer. Message:', msg);
    } else {
      // Para otros errores, imprimir un mensaje más corto pero sin el stack completo.
      if (query) {
        console.warn(
          'Database operation failed (query error), falling back to contentlayer. Message:',
          msg,
          '\nQuery:',
          query,
          params ? `\nParams: ${JSON.stringify(params)}` : ''
        );
      } else {
        console.warn('Database operation failed, falling back to contentlayer. Message:', msg);
      }

      // Give a helpful next-step hint when the error might mean migrations are missing
      console.warn('Hint: if the database schema is out-of-date, run `pnpm run db:migrate` and then `pnpm run db:seed` (if needed).');
    }

    // If developer requests verbose DB logs, print the full error object/stack for debugging.
    if (process.env.DB_VERBOSE_LOG === '1') {
      try {
        // eslint-disable-next-line no-console
        console.debug('Verbose DB error details:', error);
        // eslint-disable-next-line no-console
        if (error && typeof (error as any).stack === 'string') {
          console.debug('Stack:', (error as any).stack);
        }
      } catch {
        // ignore logging errors
      }
    }
    return fallback;
  }
}
