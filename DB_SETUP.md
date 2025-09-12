Uso de Supabase (optimizado para Vercel)

Resumen

- Motor: Supabase Postgres (recomendado si quieres integrar Storage/Auth/Realtime).
- Esquema: definido en `db/schema.ts` con Drizzle (pg-core). Funciona en Supabase porque es Postgres.
- Migraciones: en carpeta `drizzle/` generadas por `drizzle-kit`.
- Seed: scripts en `scripts/db/` permiten poblar `posts`, `projects`, `services`, `streams`.

Por qué usar Supabase en Vercel

- Integración sencilla con Auth y Storage (si necesitas subida de imágenes o sesiones).
- Supabase ofrece un panel y roles gestionados; puedes crear una `SERVICE_ROLE` para tareas de migración/seed.
- Para Vercel Serverless, Supabase es una opción madura y bien soportada.

Variables de entorno recomendadas

- `SUPABASE_DB_URL` - URL de conexión Postgres (ej: provided by Supabase project). Usada por `db/client.ts`.
- `SUPABASE_URL` - URL pública del proyecto Supabase (para el SDK JS).
- `SUPABASE_SERVICE_ROLE_KEY` - clave de servicio para tareas administrativas (migraciones/seed). Guárala en Vercel como Environment Secret.
- Alternativas/compatibilidad:
  - `POSTGRES_URL` o `DATABASE_URL` siguen siendo compatibles (legacy). `db/client.ts` las acepta como fallback.

Aplicar migraciones y poblar datos (Supabase)

1) Crear el proyecto Supabase y copiar credenciales.
   - En Supabase Cloud: crea un nuevo proyecto y copia la `Database URL` y la `Anon`/`Service Role Key`.
2) En Vercel: añade las variables `SUPABASE_DB_URL`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` en Settings > Environment Variables.
3) Localmente: crea `.env.local` con las mismas variables para pruebas.
4) Ejecuta migraciones (local):

```bash
pnpm db:migrate
```

   - Este script ejecuta `scripts/db/migrate-supabase.ts` y usa `POSTGRES_URL`/`DATABASE_URL`/`SUPABASE_DB_URL`.

5) Ejecuta seeds (opcional):

```bash
pnpm db:seed
```

Migración de datos desde Neon (si vienes de Neon/Vercel Postgres)

Si actualmente tienes datos en Neon (Vercel Postgres), sigue estos pasos mínimos:

1) Dump desde Neon:

```bash
PGSOURCE=<NEON_DATABASE_URL>
pg_dump --format=custom --no-owner --no-privileges --verbs --file=neon_dump.dump "$PGSOURCE"
```

2) Restore en Supabase (usar psql/pg_restore con las credenciales de Supabase):

```bash
PGTARGET=<SUPABASE_DB_URL>
pg_restore --clean --no-owner --no-privileges --dbname="$PGTARGET" neon_dump.dump
```

Notas:
- Asegúrate de que las extensiones usadas en Neon estén disponibles en Supabase; ajusta schema si hay diferencias.
- Si tu base usa roles o funciones específicas, revisa permisos después del restore.

Cambios en el código

- `db/client.ts` ahora prioriza `SUPABASE_DB_URL` y emite advertencias si `SUPABASE_URL`/`SERVICE_ROLE_KEY` no están definidos.
- `scripts/db/migrate-supabase.ts` ya es el script recomendado para migraciones.

Pruebas y verificación

1) En local: crea `.env.local` con `SUPABASE_DB_URL`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.
2) Ejecuta:

```bash
pnpm db:migrate
pnpm db:seed
pnpm test
```

Siguientes pasos opcionales

- Cambiar el driver a `@supabase/postgres-js` para mejor comportamiento en serverless (recomendado si experimentas problemas de conexiones). Esto requiere añadir la dependencia y adaptar `db/client.ts`.
- Añadir un job en Vercel que ejecute `pnpm db:migrate` después de cada deploy.

Si quieres, puedo:

1. Cambiar el driver a `@supabase/postgres-js` y ajustar `db/client.ts`.
2. Añadir scripts para automatizar dump/restore entre Neon y Supabase.
3. Crear un pequeño endpoint/Admin para verificar la conexión y mostrar versión de DB.

Dime qué quieres que implemente ahora y lo hago.

