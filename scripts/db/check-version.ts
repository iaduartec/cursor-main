/**
Resumen generado automáticamente.

scripts/db/check-version.ts

2025-09-13T06:20:07.384Z

——————————————————————————————
Archivo .ts: check-version.ts
Tamaño: 642 caracteres, 21 líneas
Resumen básico generado automáticamente sin análisis de IA.
Contenido detectado basado en extensión y estructura básica.
*/
// scripts/db/check-version.ts
// Small helper to check DB connectivity and version via exported client
import type { Sql } from 'postgres';

type SqlModuleShape =
  | { default?: { sql?: Sql } }
  | { sql?: Sql };

(async () => {
  try {
    const mod = (await import('../../db/client')) as SqlModuleShape;
    const exported = mod.default ?? mod;
    const sql = exported.sql;

    if (typeof sql !== 'function') {
      const keys = Object.keys(exported ?? {});
      console.error(
        'El cliente sql exportado no es una función. exports:',
        keys.length > 0 ? keys : 'sin claves'
      );
      process.exit(2);
    }

    const res = (await sql`select version()`) as Array<{ version?: string }>;
    const version = res[0]?.version ?? 'desconocida';
    console.log('pg version:', version);
    await sql.end?.();
  } catch (err) {
    console.error('Error comprobando versión de Postgres:', err);
    process.exit(1);
  }
})();
