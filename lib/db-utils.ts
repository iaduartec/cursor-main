import { db } from '../db/client';

// Detecta si hay configuración de base de datos disponible en el entorno.
// Soporta nombres estándar y también los prefijos `cxz_` usados en entornos locales.
export const hasDb = () => {
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

export async function withDb<T>(operation: () => Promise<T>, fallback: T): Promise<T> {
  if (!hasDb()) {
    return fallback;
  }

  try {
    return await operation();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const causeCode = (error as { code?: string }).code;

    const isNetworkError =
      /getaddrinfo|ENOTFOUND|EAI_AGAIN/i.test(message) || causeCode === 'ENOTFOUND';

    if (isNetworkError) {
      console.warn(
        'Database unavailable (network error). Falling back to contentlayer. Message:',
        message
      );
    } else {
      console.warn(
        'Database operation failed, falling back to contentlayer. Message:',
        message
      );
    }

    return fallback;
  }
}

export type DbInstance = typeof db;
