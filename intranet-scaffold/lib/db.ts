import postgres from "postgres";

// Provide either a real Postgres client (postgres) or a lightweight
// in-memory adapter used for local E2E when USE_IN_MEMORY_DB=1 is set.
let sql: any = null;

declare global {
  var __inMemorySqlAdapter: any | undefined;
}

function createInMemoryAdapter() {
  const state = {
    projects: [] as any[],
    nextId: 1,
  };

  // sql should be callable as a template tag: sql`SELECT ...`
  const adapter = async function sqlTag(strings: TemplateStringsArray, ...values: any[]) {
    // Reconstruct a best-effort query string for routing decisions
    let q = '';
    for (let i = 0; i < strings.length; i++) {
      q += strings[i];
      if (i < values.length) q += values[i];
    }
    const nq = q.replace(/\s+/g, ' ').trim().toLowerCase();

    // SELECT all projects
    if (nq.startsWith('select') && nq.includes('from projects')) {
      // Return a shallow copy sorted by created_at desc
      const rows = state.projects.slice().sort((a, b) => (b.created_at || 0) - (a.created_at || 0));
      return rows;
    }

    // INSERT INTO projects (...) VALUES (${slug}, ${title}, ${description}, ${hero_image}) RETURNING ...
    if (nq.includes('insert into projects')) {
      // values = [slug, title, description, hero_image]
      const [slug, title, description, hero_image] = values;
      const now = Date.now();
      const row = {
        id: state.nextId++,
        slug: slug ?? null,
        title: title ?? null,
        description: description ?? null,
        hero_image: hero_image ?? null,
        created_at: now,
      };
      state.projects.push(row);
      return [row];
    }

    // UPDATE projects SET ... WHERE id = ${id} RETURNING ...
    if (nq.includes('update projects set')) {
      // Expect values = [slug, title, description, hero_image, id]
      const id = values[values.length - 1];
      const slug = values[0];
      const title = values[1];
      const description = values[2];
      const hero_image = values[3];
      const idx = state.projects.findIndex(p => p.id === Number(id));
      if (idx === -1) return [];
      const updated = Object.assign({}, state.projects[idx], {
        slug: slug ?? state.projects[idx].slug,
        title: title ?? state.projects[idx].title,
        description: description ?? state.projects[idx].description,
        hero_image: hero_image ?? state.projects[idx].hero_image,
      });
      state.projects[idx] = updated;
      return [updated];
    }

    // DELETE FROM projects WHERE id = ${id}
    if (nq.includes('delete from projects')) {
      const id = values[0];
      const idx = state.projects.findIndex(p => p.id === Number(id));
      if (idx !== -1) state.projects.splice(idx, 1);
      return { ok: true };
    }

    // Fallback: return empty
    return [];
  } as any;

  adapter.end = async function () { /* no-op */ };
  // Attach internal state for debugging/inspection when running in-memory DB
  try {
    (adapter as any).__state = state;
  } catch (e) {
    // ignore if read-only
  }
  return adapter;
}

export function getDb() {
  if (!sql) {
    // If requested, use in-memory adapter (useful for local dev/E2E)
    if (process.env.USE_IN_MEMORY_DB === '1' || process.env.USE_IN_MEMORY_DB === 'true') {
      // Preserve adapter instance across HMR / module reloads in Next dev
      if (typeof globalThis.__inMemorySqlAdapter !== 'undefined') {
        sql = globalThis.__inMemorySqlAdapter;
      } else {
        sql = createInMemoryAdapter();
        try { globalThis.__inMemorySqlAdapter = sql; } catch (e) { /* ignore */ }
      }
      return sql;
    }

    const dbUrl = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.cxz_POSTGRES_URL;
    if (!dbUrl) throw new Error("Database URL not configured. Set SUPABASE_DB_URL or DATABASE_URL.");
    sql = postgres(dbUrl, { ssl: 'require' });
  }
  return sql;
}

export async function closeDb() {
  if (sql) {
    if (typeof sql.end === 'function') {
      await sql.end({ timeout: 5 }).catch(() => { /* ignore */ });
    }
    sql = null;
  }
}
