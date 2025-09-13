/**
Resumen generado automáticamente.

drizzle.config.ts

2025-09-13T06:20:07.371Z

——————————————————————————————
Archivo .ts: drizzle.config.ts
Tamaño: 717 caracteres, 27 líneas
Resumen básico generado automáticamente sin análisis de IA.
Contenido detectado basado en extensión y estructura básica.
*/
import type { Config } from 'drizzle-kit';

const useInMemory = Boolean(process.env.USE_IN_MEMORY_DB && process.env.USE_IN_MEMORY_DB !== '0');

const pgConfig: Config = {
  schema: './db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    // Supabase connection string
    url: process.env.POSTGRES_URL || process.env.DATABASE_URL || '',
  },
};

const sqliteInMemoryConfig: Config = {
  schema: './db/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    // Drizzle-kit uses this for sqlite connection strings; ':memory:' for in-memory
    url: 'file::memory:?cache=shared',
  },
};

export default (useInMemory ? sqliteInMemoryConfig : pgConfig) satisfies Config;

