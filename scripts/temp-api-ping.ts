import http from 'http';

const PORT = process.env.TEMP_API_PING_PORT ? Number(process.env.TEMP_API_PING_PORT) : 4000;

const server = http.createServer(async (req, res) => {
  if (!req.url) return res.end();
  if (req.url === '/api/db-ping') {
    try {
      // Lazy import so the server can start even if importing at module load would fail
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { sql } = require('../db/client');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const result = await sql`select version()`;
      const version = result && result.rows && result.rows[0] ? result.rows[0].version || result.rows[0] : result.rows[0];
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true, version }));
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error('Error handling /api/db-ping:', err && err.stack ? err.stack : err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, error: String(err.message || err) }));
    }
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ ok: false, error: 'Not found' }));
});

server.listen(PORT, '0.0.0.0', () => {
  // eslint-disable-next-line no-console
  console.log(`temp-api-ping listening on http://0.0.0.0:${PORT}/api/db-ping`);
});

process.on('SIGINT', () => process.exit(0));
