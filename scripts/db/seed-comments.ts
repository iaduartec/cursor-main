/* eslint-disable no-console */
import fs from 'fs';
import path from 'path';

(async () => {
  const comments = [
    { comment: 'Primer comentario de prueba' },
    { comment: 'Segundo comentario de prueba' },
  ];

  const dbUrl = process.env.SUPABASE_DB_URL || process.env.POSTGRES_URL || process.env.DATABASE_URL;
  if (!dbUrl) {
    // fallback: write JSON seed file for local testing
    const outDir = path.join(process.cwd(), 'data', 'seeds');
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, 'comments.json'), JSON.stringify(comments, null, 2), 'utf8');
    console.log('No DB URL found — wrote data/seeds/comments.json with sample comments');
    process.exit(0);
  }

  // If a DB URL is present, run a simple insert using postgres client
  try {
    // dynamic import to avoid adding optional deps
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    const req = eval('require');
    const postgres = req('postgres');
    const sql = postgres(dbUrl, { prepare: false });
    for (const c of comments) {
      await sql`insert into comments (comment, created_at) values (${c.comment}, now())`;
    }
    await sql.end();
    console.log('Inserted sample comments into DB');
  } catch (err) {
    console.error('Fallo al insertar en la DB:', err);
    process.exit(1);
  }

})();
