// Diagnostic script: run simple queries to reproduce DB errors
// Diagnostic script: run simple queries to reproduce DB errors
import { sql, db, type DrizzleClient } from '../../db/client';
import type { Database } from '../../db/schema';

async function run() {
  try {
    console.log('Testing low-level sql client...');
    if (typeof sql === 'function') {
      const res = await sql`select version()`;
      console.log('Version result:', res[0]);
    } else {
      console.log('sql client is not a function, value:', typeof sql, sql);
    }
  } catch (err) {
    console.error('Low-level sql error:', err);
  }

  try {
    console.log('\nTesting drizzle select via db (projects)...');
    const typedDb = db as unknown as DrizzleClient;
    const rows = await typedDb.select().from((await import('../../db/schema')).projects).limit(1);
    console.log('Projects rows:', rows);
  } catch (err) {
    console.error('Drizzle select error (projects):', err);
  }

  try {
    console.log('\nTesting drizzle select via db (services)...');
    const typedDb = db as unknown as DrizzleClient;
    const rows = await typedDb.select().from((await import('../../db/schema')).services).limit(1);
    console.log('Services rows:', rows);
  } catch (err) {
    console.error('Drizzle select error (services):', err);
  }

  try {
    console.log('\nTesting drizzle select via db (streams)...');
    const typedDb = db as unknown as DrizzleClient;
    const rows = await typedDb.select().from((await import('../../db/schema')).streams).limit(1);
    console.log('Streams rows:', rows);
  } catch (err) {
    console.error('Drizzle select error (streams):', err);
  }

  try {
    // close sql if available
    if (sql && typeof (sql as unknown as { end?: unknown }).end === 'function') {
      await (sql as unknown as { end?: () => Promise<unknown> }).end?.();
      console.log('\nClosed low-level sql connection.');
    }
  } catch (err) {
    // ignore
  }
}

run().catch((e) => {
  console.error('Unhandled error in diagnostic script:', e);
  process.exit(1);
});
