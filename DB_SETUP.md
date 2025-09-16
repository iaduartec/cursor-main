# DB_SETUP

<!--
Resumen generado automáticamente.
-->
# DB_SETUP

<!--
Resumen generado automáticamente.

DB_SETUP.md

2025-09-13T06:20:07.355Z

——————————————————————————————
Archivo .md: DB_SETUP.md
Tamaño: 7962 caracteres, 195 líneas
Resumen básico generado automáticamente sin análisis de IA.
Contenido detectado basado en extensión y estructura básica.
-->
Uso de Supabase (optimizado para Vercel)

Resumen

- Motor: Postgres (Neon/Vercel). Si necesitas Storage/Auth/Realtime puedes integrar servicios externos; Supabase se considera una opción legacy en este repositorio.
- Esquema: definido en `db/schema.ts` con Drizzle (pg-core). Funciona en Supabase porque es Postgres.
- Migraciones: en carpeta `drizzle/` generadas por `drizzle-kit`.
- Seed: scripts en `scripts/db/` permiten poblar `posts`, `projects`, `services`, `streams`.

Por qué usar Supabase en Vercel

- Integración sencilla con Auth y Storage (si necesitas subida de imágenes o sesiones).
- Supabase ofrece un panel y roles gestionados; puedes crear una `SERVICE_ROLE` para tareas de migración/seed.
- Para Vercel Serverless, Supabase es una opción madura y bien soportada.

Variables de entorno recomendadas

- `POSTGRES_URL` - URL de conexión Postgres (p. ej. la "Connection string" que provee Neon/Vercel). Este repo prioriza `POSTGRES_URL`.
- `DATABASE_URL` - fallback genérico (por compatibilidad con otras infraestructuras).
- `SUPABASE_DB_URL` - aceptada como fallback por compatibilidad con despliegues previos, pero considerada obsoleta para nuevas instalaciones.
- `SUPABASE_URL` - URL pública del proyecto Supabase (solo necesaria si usas el SDK JS para Auth/Storage).
- `SUPABASE_SERVICE_ROLE_KEY` / `SUPABASE_ANON_KEY` - claves para el SDK JS (opcional).

Orden de precedencia en `db/client.ts` (qué variable se usa para la conexión SQL):
 
1. `POSTGRES_URL` (recomendado)
2. `DATABASE_URL`
3. `SUPABASE_DB_URL` (compatibilidad / deprecated)

Nota de seguridad y despliegue

- Nunca comitees las claves en el repositorio. Usa `.env.local` para pruebas locales y Secrets/Environment Variables en Vercel para deploy.
- Para las operaciones administrativas (migrations, seed), usa `SUPABASE_SERVICE_ROLE_KEY` o una variable dedicada con permisos de escritura.

Ejemplo de `.env.local` (local):

```powershell
# URL de conexión SQL (Postgres)
SUPABASE_DB_URL=postgresql://postgres:password@db.host.supabase.co:5432/postgres

# SDK Supabase (opcional, para Auth/Storage)
SUPABASE_URL=https://xyz.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Ejemplo de variables en Vercel (Environment Variables / Secrets):

- `SUPABASE_DB_URL` = `postgresql://<DB_USER>:<DB_PASS>@<HOST>:5432/<DB_NAME>` (Database URL from Supabase project)
- `SUPABASE_URL` = `https://xyz.supabase.co` (Supabase public URL)
- `SUPABASE_SERVICE_ROLE_KEY` = `SERVICE_ROLE_KEY_HERE` (Service role key — marca como Secret)

Comportamiento del SDK y el driver

- El archivo `db/client.ts` intenta usar en runtime el driver `@supabase/postgres-js` (serverless-friendly) mediante `require` dinámico; si no está instalado, hace fallback al paquete `postgres`.
- Por eso el código no falla la instalación si `@supabase/postgres-js` no está en `package.json`. Si prefieres, puedes instalarlo explícitamente y ajustar `package.json` para forzar ese driver.

Variables útiles para debugging

- `NODE_ENV=development` para ejecutar `pnpm dev` localmente.
- `SUPABASE_DB_URL` en una shell temporal para ejecutar scripts puntuales sin `.env.local`, por ejemplo:

```powershell
$env:SUPABASE_DB_URL="postgresql://..."
pnpm exec tsx scripts/db/check-version.ts
Guía de conexión y despliegue (Neon / Postgres)

Aplicar migraciones y poblar datos (Supabase)

- Motor: Neon (Vercel Postgres) / Postgres (recomendado para este repositorio).
- Esquema: definido en `db/schema.ts` con Drizzle (pg-core). Funciona con cualquier Postgres compatible.
- Migraciones: en carpeta `drizzle/` generadas por `drizzle-kit`.
- Seed: scripts en `scripts/db/` permiten poblar `posts`, `projects`, `services`, `streams`.
1. En Vercel: añade las variables `SUPABASE_DB_URL`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` en Settings > Environment Variables.

Por qué usar Neon / Postgres en Vercel
1. Localmente: crea `.env.local` con las mismas variables para pruebas.
- Integración nativa con Vercel y buena experiencia serverless.
- Si necesitas integración con Auth/Storage, aún puedes usar proveedores externos; este repo usa Drizzle para acceso SQL directo.

```bash
Variables de entorno recomendadas
pnpm db:migrate
- `POSTGRES_URL` - URL de conexión Postgres (p. ej. la "Connection string" que provee Neon/Vercel). Este repo prioriza `POSTGRES_URL`.
- `DATABASE_URL` - fallback genérico (por compatibilidad con otras infraestructuras).
- `SUPABASE_DB_URL` - aceptada como fallback por compatibilidad con despliegues previos, pero considerada obsoleta para nuevas instalaciones.
- Si usas el SDK de Supabase para Auth/Storage, conserva las variables `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` solo para esa funcionalidad.
```bash
pnpm db:seed
```

Orden de precedencia en `db/client.ts` (qué variable se usa para la conexión SQL):
 
1. `POSTGRES_URL` (recomendado)
Migración de datos desde Neon (si vienes de Neon/Vercel Postgres)

2. `DATABASE_URL`
3. `SUPABASE_DB_URL` (compatibilidad / deprecated)
Si actualmente tienes datos en Neon (Vercel Postgres), sigue estos pasos mínimos:

Nota: en este proyecto el driver preferido es `postgres` (paquete `postgres`). Evitamos forzar dependencias opcionales en runtime para que la instalación sea robusta.
1. Dump desde Neon:

1. Crear el proyecto Neon / Postgres y copiar credenciales.
```bash
PGSOURCE=<NEON_DATABASE_URL>
    - En Neon/Vercel: copia la `Connection string` (POSTGRES_URL) y configúrala como variable de entorno en Vercel.
pg_dump --format=custom --no-owner --no-privileges --verbs --file=neon_dump.dump "$PGSOURCE"
```
1. En Vercel: añade `POSTGRES_URL` (o `DATABASE_URL`) en Settings > Environment Variables.

- `SUPABASE_DB_URL` - aceptada únicamente como fallback por compatibilidad con despliegues previos; para nuevas instalaciones usa `POSTGRES_URL`.
1. Localmente: crea `.env.local` con las mismas variables para pruebas.

```bash
Nota: Este script ejecuta `scripts/db/migrate-supabase.ts` (nombre por compatibilidad) y usa `POSTGRES_URL`/`DATABASE_URL`/`SUPABASE_DB_URL`.
PGTARGET=<SUPABASE_DB_URL>
pg_restore --clean --no-owner --no-privileges --dbname="$PGTARGET" neon_dump.dump
Migración de datos desde Neon (si vienes de Neon/Vercel Postgres)
3. `SUPABASE_DB_URL` (solo fallback / legacy)

Notas:

- Asegúrate de que las extensiones usadas en Neon estén disponibles en Supabase; ajusta schema si hay diferencias.
- Si tu base usa roles o funciones específicas, revisa permisos después del restore.

- `db/client.ts` ahora prioriza `SUPABASE_DB_URL` y emite advertencias si `SUPABASE_URL`/`SERVICE_ROLE_KEY` no están definidos.


`db/client.ts` ahora prioriza `POSTGRES_URL` y emite advertencias si `SUPABASE_URL`/`SERVICE_ROLE_KEY` no están definidos.
- `scripts/db/migrate-supabase.ts` ya es el script recomendado para migraciones.
`scripts/db/migrate-supabase.ts` ya es el script recomendado para migraciones.
Pruebas y verificación

1. En local: crea `.env.local` con `SUPABASE_DB_URL`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.

1. Ejecuta:

```bash
pnpm db:migrate
pnpm db:seed
pnpm test
```

- Cambiar el driver a `@supabase/postgres-js` para mejor comportamiento en serverless (recomendado si experimentas problemas de conexiones). Esto requiere añadir la dependencia y adaptar `db/client.ts`.
- Añadir un job en Vercel que ejecute `pnpm db:migrate` después de cada deploy.

Problema conocido al instalar dependencias

Si al ejecutar `pnpm install` obtienes un error 404 para `@supabase/postgres-js`, prueba lo siguiente:

1. Asegúrate de que `package.json` no contiene `@supabase/postgres-js` (si existe, elimínala).

1. Regenera el lockfile (opción segura):

```powershell
pnpm install --no-frozen-lockfile
```

1. Si el paso 2 falla, elimina el lockfile manualmente y reinstala:

```powershell
# En el directorio del proyecto
Remove-Item pnpm-lock.yaml -Force
pnpm install
```

1. Si aún hay problemas, revisa las entradas en `pnpm-lock.yaml.bak` (si existe) o elimina el backup y vuelve a intentar.

Nota: en este proyecto implementamos un patrón de "require dinámico" en `db/client.ts` para evitar que la falta de un driver opcional rompa la instalación. Si prefieres instalar a fuerza `@supabase/postgres-js`, confirma y lo añadimos explícitamente.
Verificación rápida (comandos usados en esta migración)

Estos son los comandos que usamos para validar la conexión y el estado de la base de datos sin depender de Next/Contentlayer:

- Comprobar versión de Postgres (script oficial):
```powershell
pnpm exec tsx scripts/db/check-version.ts
```

- One-shot: obtener la versión vía el cliente del proyecto (sin HTTP):
```powershell
pnpm exec tsx scripts/run-db-ping-oneoff.ts
```

- Servidor temporal HTTP (opcional) que expone `/api/db-ping` en el puerto 4000:

```powershell
pnpm exec tsx scripts/temp-api-ping.ts
Buenas prácticas y recordatorios

- No comitees credenciales: usa `.env.local` para pruebas locales y configura variables en Vercel para deploy.
- En Vercel, define `SUPABASE_DB_URL`, `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` como Environment Variables (Secret).
- Si Contentlayer da errores de parseo MDX en Windows, revisa los frontmatters de los `.mdx` afectados; son warnings que pueden impedir la generación de `.contentlayer`.

Si quieres, puedo:

1. Cambiar el driver a `@supabase/postgres-js` y ajustar `db/client.ts`.
2. Añadir scripts para automatizar dump/restore entre Neon y Supabase.
3. Crear un pequeño endpoint/Admin para verificar la conexión y mostrar versión de DB.

Dime qué quieres que implemente ahora y lo hago.

