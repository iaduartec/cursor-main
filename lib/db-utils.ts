import { db } from '../db/client';

// Detecta si hay configuración de base de datos disponible en el entorno.
// Soporta nombres estándar y también los prefijos `cxz_` usados en .env local.
export const hasDb = () => Boolean(
  process.env.SUPABASE_DB_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.DATABASE_URL ||
  process.env.cxz_POSTGRES_URL ||
  process.env.cxz_POSTGRES_PRISMA_URL ||
  process.env.cxz_POSTGRES_URL_NON_POOLING
);

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
    const msg = (error && (error as any).message) ? (error as any).message : String(error);
    const causeCode = (error && (error as any).code) ? (error as any).code : undefined;
    const isNetworkError = /getaddrinfo|ENOTFOUND|EAI_AGAIN/i.test(msg) || causeCode === 'ENOTFOUND';
    if (isNetworkError) {
      // eslint-disable-next-line no-console
      console.warn('Database unavailable (network error). Falling back to contentlayer. Message:', msg);
    } else {
      // Para otros errores, imprimir un mensaje más corto pero sin el stack completo.
      // eslint-disable-next-line no-console
      console.warn('Database operation failed, falling back to contentlayer. Message:', msg);
    }
    return fallback;
  }
}
