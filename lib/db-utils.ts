// Detecta si hay configuración de base de datos disponible en el entorno.
// Soporta nombres estándar y también los prefijos `cxz_` usados en .env local.
export const hasDb = () => {
  // In development, avoid attempting DB connections unless explicitly enabled.
  // Set ENABLE_DB_IN_DEV=1 or FORCE_DB_CONNECT=1 to override in local dev.
  const isProd =
    process.env.NODE_ENV === 'production' ||
    process.env.VERCEL === '1' ||
    Boolean(process.env.VERCEL_ENV);
  if (
    !isProd &&
    process.env.ENABLE_DB_IN_DEV !== '1' &&
    process.env.FORCE_DB_CONNECT !== '1'
  ) {
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
    const msg =
      error && (error as Error).message
        ? (error as Error).message
        : String(error);
    const causeCode =
      error && (error as { code?: string }).code
        ? (error as { code?: string }).code
        : undefined;
    const isNetworkError =
      /getaddrinfo|ENOTFOUND|EAI_AGAIN/i.test(msg) || causeCode === 'ENOTFOUND';
    if (isNetworkError) {
      console.warn(
        'Database unavailable (network error). Falling back to contentlayer. Message:',
        msg
      );
    } else {
      // Para otros errores, imprimir un mensaje más corto pero sin el stack completo.

      console.warn(
        'Database operation failed, falling back to contentlayer. Message:',
        msg
      );
    }
    return fallback;
  }
}
