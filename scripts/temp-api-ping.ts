/**
Resumen generado automáticamente.

scripts/temp-api-ping.ts

2025-09-13T06:20:07.386Z

——————————————————————————————
Archivo .ts: temp-api-ping.ts
Tamaño: 1139 caracteres, 31 líneas
Resumen básico generado automáticamente sin análisis de IA.
Contenido detectado basado en extensión y estructura básica.
*/
import http from 'http';
import { sql } from '../db/client';

const PORT = process.env.TEMP_API_PING_PORT ? Number(process.env.TEMP_API_PING_PORT) : 4000;

const server = http.createServer(async (req, res) => {
  if (!req.url) {return res.end();}
  if (req.url === '/api/db-ping') {
    try {
      const result = await sql`select version()`;
      const version = result && result.rows && result.rows[0] ? result.rows[0].version || result.rows[0] : result.rows[0];
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true, version }));
    } catch (err: any) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, error: String(err.message || err) }));
    }
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ ok: false, error: 'Not found' }));
});

server.listen(PORT, () => {
   
  console.log(`temp-api-ping listening on http://localhost:${PORT}/api/db-ping`);
});

process.on('SIGINT', () => process.exit(0));
