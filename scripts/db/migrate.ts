import { migrate } from 'drizzle-orm/vercel-postgres/migrator';
import { db } from '../../db/client';

async function run() {
  console.log('Applying database migrations from ./drizzle ...');
  await migrate(db, { migrationsFolder: 'drizzle' });
  console.log('Migrations applied successfully');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

