/**
Resumen generado automáticamente.

scripts/print-db-env.ts

2025-09-13T06:20:07.386Z

——————————————————————————————
Archivo .ts: print-db-env.ts
Tamaño: 684 caracteres, 12 líneas
Resumen básico generado automáticamente sin análisis de IA.
Contenido detectado basado en extensión y estructura básica.
*/
import dotenv from 'dotenv';
dotenv.config();
console.log('POSTGRES_URL=', process.env.POSTGRES_URL);
console.log('DATABASE_URL=', process.env.DATABASE_URL);
// Supabase-specific env vars are deprecated for this project (we use Neon/Postgres)
console.log('SUPABASE_DB_URL (deprecated)=', process.env.SUPABASE_DB_URL);
console.log('SUPABASE_URL (deprecated)=', process.env.SUPABASE_URL);
console.log('SUPABASE_SERVICE_ROLE_KEY (deprecated)=', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'present' : 'missing');

