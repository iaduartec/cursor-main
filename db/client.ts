// Simplified database client - only Contentlayer is used
// This file is kept for compatibility but no longer connects to any database

// Fake database client that returns empty results
class FakeQuery {
  from() {
    return this;
  }
  where() {
    return this;
  }
  orderBy() {
    return this;
  }
  limit() {
    return this;
  }
  offset() {
    return this;
  }
  groupBy() {
    return this;
  }
  then(onfulfilled?: (value: unknown) => unknown): Promise<unknown> {
    if (typeof onfulfilled === 'function') {
      try {
        onfulfilled([] as unknown);
      } catch {
        /* ignore */
      }
      try {
        onfulfilled([] as unknown);
      } catch {
        /* ignore */
      }
    }
    return Promise.resolve([] as unknown);
  }
}

const fakeDb = {
  select: () => new FakeQuery(),
};

export type DrizzleClient = any;
export const db = fakeDb as unknown as DrizzleClient;

// Low-level template-tag SQL client type
export type SqlTag = ((
  strings: TemplateStringsArray,
  ...values: unknown[]
) => Promise<unknown>) & {
  end?: () => Promise<unknown>;
  __state?: unknown;
};

// Fake SQL client
export const sql: SqlTag = (() => Promise.resolve([])) as SqlTag;
