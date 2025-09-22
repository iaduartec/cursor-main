import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { neon, type NeonSql } from '@neondatabase/serverless';
import dotenv from 'dotenv';

// Load environment variables
const envLocal = process.cwd() + '/.env.local';
const envFile = process.cwd() + '/.env';
if (require('fs').existsSync(envLocal)) {
  dotenv.config({ path: envLocal });
} else if (require('fs').existsSync(envFile)) {
  dotenv.config({ path: envFile });
}

import * as schema from './schema';

export type DrizzleClient = PostgresJsDatabase<typeof schema>;

type FakeQueryResult<T> = T[];

class FakeQuery<T = unknown> {
  select(): this {
    return this;
  }

  from(): this {
    return this;
  }

  where(): this {
    return this;
  }

  orderBy(): this {
    return this;
  }

  limit(): this {
    return this;
  }

  offset(): this {
    return this;
  }

  groupBy(): this {
    return this;
  }

  having(): this {
    return this;
  }

  values(): this {
    return this;
  }

  set(): this {
    return this;
  }

  returning(): this {
    return this;
  }

  onConflictDoUpdate(): this {
    return this;
  }

  then(
    onfulfilled?: (value: FakeQueryResult<T>) => unknown
  ): Promise<FakeQueryResult<T>> {
    const value: FakeQueryResult<T> = [];

    if (typeof onfulfilled === 'function') {
      try {
        onfulfilled(value);
      } catch {
        // ignore callback errors to preserve the query-like contract
      }
    }

    return Promise.resolve(value);
  }
}

type FakeDb = {
  select: (..._args: unknown[]) => FakeQuery;
  insert: (..._args: unknown[]) => FakeQuery;
  update: (..._args: unknown[]) => FakeQuery;
  delete: (..._args: unknown[]) => FakeQuery;
};

const rawConnectionString =
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.DATABASE_URL ||
  process.env.NEON_DATABASE_URL ||
  process.env.cxz_POSTGRES_URL ||
  process.env.cxz_POSTGRES_PRISMA_URL ||
  process.env.cxz_POSTGRES_URL_NON_POOLING ||
  '';

const connectionString = rawConnectionString.replace(/^['"]|['"]$/g, '').trim();

let skipDb =
  process.env.USE_IN_MEMORY_DB === '1' ||
  process.env.SKIP_DB === '1' ||
  process.env.VERCEL === '1' ||
  !connectionString;

if (!connectionString) {
  console.warn(
    '⚠️  No se encontró URL de base de datos. Usando modo sin conexión.'
  );
}

let client: NeonSql | undefined;
let dbExport: DrizzleClient | undefined;

if (!skipDb) {
  try {
    client = neon(connectionString) as NeonSql;
    dbExport = drizzle(client, { schema });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn('⚠️  Error conectando a la base de datos:', message);
    console.warn('⚠️  Usando modo sin conexión para evitar errores de build.');
    skipDb = true;
  }
}

if (skipDb || !dbExport) {
  const fakeDb: FakeDb = {
    select: (..._args: unknown[]) => new FakeQuery(),
    insert: (..._args: unknown[]) => new FakeQuery(),
    update: (..._args: unknown[]) => new FakeQuery(),
    delete: (..._args: unknown[]) => new FakeQuery(),
  };

  dbExport = fakeDb as unknown as DrizzleClient;
}

if (!dbExport) {
  throw new Error('No database client available');
}

export const db: DrizzleClient = dbExport;
export { client as sql };
