import type { Options, Sql } from 'postgres';

export interface NeonConfig {
  fetchConnectionCache: boolean;
}

export declare const neonConfig: NeonConfig;

export type NeonSql<T = unknown> = Sql<T> & {
  end?: () => Promise<void>;
};

export declare function neon<T = unknown>(
  connectionString: string,
  options?: Options<Record<string, unknown>>
): NeonSql<T>;

