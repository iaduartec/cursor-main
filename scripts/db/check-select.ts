// Diagnostic script: run simple queries to reproduce DB errors
import type { NeonSql } from '@neondatabase/serverless';
import { sql, db } from '../../db/client';

async function run() {
  try {
    console.log('Testing low-level sql client...');
    if (typeof sql === 'function') {
      const query = sql as NeonSql<Record<string, unknown>>;
      const res = await query`select version()`;
      console.log('Version result:', res[0]);
    } else {
      console.log('sql client is not a function, value:', typeof sql, sql);
    }
  } catch (err) {
    console.error('Low-level sql error:', err);
  }

  try {
    console.log('\nTesting drizzle select via db (projects)...');
    const typedDb = db as unknown as any;
    const rows = await typedDb
      .select()
      .from((await import('../../db/schema')).projects)
      .limit(1);
    console.log('Projects rows:', rows);
  } catch (err) {
    console.error('Drizzle select error (projects):', err);
  }

  try {
    console.log('\nTesting drizzle select via db (services)...');
    const typedDb = db as unknown as any;
    const rows = await typedDb
      .select()
      .from((await import('../../db/schema')).services)
      .limit(1);
    console.log('Services rows:', rows);
  } catch (err) {
    console.error('Drizzle select error (services):', err);
  }

  try {
    console.log('\nTesting drizzle select via db (streams)...');
    const typedDb = db as unknown as any;
    const rows = await typedDb
      .select()
      .from((await import('../../db/schema')).streams)
      .limit(1);
    console.log('Streams rows:', rows);
  } catch (err) {
    console.error('Drizzle select error (streams):', err);
  }

  try {
    // close sql if available
    const closer = sql as NeonSql;
    if (sql && typeof closer.end === 'function') {
      await closer.end();
      console.log('\nClosed low-level sql connection.');
    }
  } catch {
    // ignore
  }
}

run().catch(e => {
  console.error('Unhandled error in diagnostic script:', e);
  process.exit(1);
});
