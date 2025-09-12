async function main() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require('../db/client');
    const sql = mod.sql;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const res = await sql`select version()`;
    // support both forms (drizzle/postgres-js) used in project: res[0].version or res.rows[0].version
    let version: any = null;
    if (Array.isArray(res) && res[0] && res[0].version) version = res[0].version;
    else if (res && res.rows && res.rows[0]) version = res.rows[0].version || res.rows[0];

    console.log(JSON.stringify({ ok: true, version }));
    if (typeof sql.end === 'function') {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      await sql.end();
    }
    process.exit(0);
  } catch (err: any) {
    console.error(JSON.stringify({ ok: false, error: String(err && err.message ? err.message : err) }));
    process.exit(1);
  }
}

main();
