/**
Resumen generado automáticamente.

intranet-scaffold/lib/db.ts

2025-09-13T06:20:07.375Z

——————————————————————————————
Archivo .ts: db.ts
Tamaño: 4101 caracteres, 122 líneas
Resumen básico generado automáticamente sin análisis de IA.
Contenido detectado basado en extensión y estructura básica.
*/
import postgres from "postgres";

// Provide either a real Postgres client (postgres) or a lightweight
// in-memory adapter used for local E2E when USE_IN_MEMORY_DB=1 is set.
let sql: unknown = null;

declare global {
  // Preserve adapter instance across HMR; add property to GlobalThis
  interface GlobalThis {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    __inMemorySqlAdapter?: unknown;
  }
}

function createInMemoryAdapter() {
  const state = {
    projects: [] as unknown as Array<{
      id: number;
      slug?: string | null;
      title?: string | null;
      description?: string | null;
      hero_image?: string | null;
      created_at?: number;
    }> ,
    nextId: 1,
  };

  // sql should be callable as a template tag: sql`SELECT ...`
  const adapter = async function sqlTag(strings: TemplateStringsArray, ...values: unknown[]) {
    // Reconstruct a best-effort query string for routing decisions
    let q = '';
    for (let i = 0; i < strings.length; i++) {
      q += strings[i];
      if (i < values.length) {q += values[i];}
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
  const [slug, title, description, hero_image] = values as [unknown, unknown, unknown, unknown];
      const now = Date.now();
      const row = {
        id: state.nextId++,
        slug: slug == null ? null : String(slug),
        title: title == null ? null : String(title),
        description: description == null ? null : String(description),
        hero_image: hero_image == null ? null : String(hero_image),
        created_at: now,
      };
      state.projects.push(row);
      return [row];
    }

    // UPDATE projects SET ... WHERE id = ${id} RETURNING ...
    if (nq.includes('update projects set')) {
      // Expect values = [slug, title, description, hero_image, id]
  const id = values[values.length - 1] as unknown;
  const slug = values[0] as unknown;
  const title = values[1] as unknown;
  const description = values[2] as unknown;
  const hero_image = values[3] as unknown;
      const idx = state.projects.findIndex(p => p.id === Number(id));
      if (idx === -1) {return [];}
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
      if (idx !== -1) {state.projects.splice(idx, 1);}
      return { ok: true };
    }

    // Fallback: return empty
    return [];
  } as unknown;

  // Ensure adapter exposes an optional `.end()` method for compatibility with callers
  try {
    (adapter as { end?: () => Promise<unknown> }).end = async function () { /* no-op */ };
  } catch {
    // ignore
  }

  // Attach internal state for debugging/inspection when running in-memory DB
  try {
    // assign to a typed slot to avoid `any`
    (adapter as { __state?: unknown }).__state = state;
  } catch (e) {
    // ignore if read-only
  }
  return adapter;
}

export function getDb(): (strings: TemplateStringsArray, ...values: unknown[]) => Promise<unknown> {
  if (!sql) {
    // If requested, use in-memory adapter (useful for local dev/E2E)
    if (process.env.USE_IN_MEMORY_DB === '1' || process.env.USE_IN_MEMORY_DB === 'true') {
      // Preserve adapter instance across HMR / module reloads in Next dev
      if (typeof (globalThis as unknown as { __inMemorySqlAdapter?: unknown }).__inMemorySqlAdapter !== 'undefined') {
        sql = (globalThis as unknown as { __inMemorySqlAdapter?: unknown }).__inMemorySqlAdapter as unknown;
      /* eslint-disable @typescript-eslint/no-explicit-any, no-var */
      } else {
        sql = createInMemoryAdapter();
  try { (globalThis as unknown as { __inMemorySqlAdapter?: unknown }).__inMemorySqlAdapter = sql; } catch (e) { /* ignore */ }
      }
      return sql as (strings: TemplateStringsArray, ...values: unknown[]) => Promise<unknown>;
    }

  // Prefer Neon/Postgres env vars. SUPABASE_DB_URL is accepted only as an
  // explicit legacy fallback if present in the environment.
  const dbUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL || process.env.cxz_POSTGRES_URL || process.env.SUPABASE_DB_URL;
  if (!dbUrl) {throw new Error("Database URL not configured. Set POSTGRES_URL or DATABASE_URL.");}
  sql = postgres(dbUrl, { ssl: 'require' });
  }
  return sql as (strings: TemplateStringsArray, ...values: unknown[]) => Promise<unknown>;
}

export async function closeDb() {
  if (sql) {
    if (typeof (sql as { end?: unknown }).end === 'function') {
      await ((sql as { end?: () => Promise<unknown> }).end?.() ?? Promise.resolve()).catch(() => { /* ignore */ });
    }
    sql = null;
  }
}
