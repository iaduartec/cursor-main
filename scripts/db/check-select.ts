// Diagnostic script: run simple queries to reproduce DB errors
// Diagnostic script: run simple queries to reproduce DB errors
import { sql, db } from '../../db/client';

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const typedDb = db as any;
    const rows = await typedDb.select().from((await import('../../db/schema')).projects).limit(1);
    console.log('Projects rows:', rows);
  } catch (err) {
    console.error('Drizzle select error (projects):', err);
  }

  try {
    console.log('\nTesting drizzle select via db (services)...');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const typedDb = db as any;
    const rows = await typedDb.select().from((await import('../../db/schema')).services).limit(1);
    console.log('Services rows:', rows);
  } catch (err) {
    console.error('Drizzle select error (services):', err);
  }

  try {
    console.log('\nTesting drizzle select via db (streams)...');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const typedDb = db as any;
    const rows = await typedDb.select().from((await import('../../db/schema')).streams).limit(1);
    console.log('Streams rows:', rows);
  } catch (err) {
    console.error('Drizzle select error (streams):', err);
  }

  try {
    // close sql if available
    if (sql && typeof (sql as any).end === 'function') {
      await (sql as any).end();
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
