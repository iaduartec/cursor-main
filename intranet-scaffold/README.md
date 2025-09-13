# Duartec Intranet (Scaffold)

Scaffold inicial para la intranet: panel admin y CRUD para Servicios, Proyectos, Streams y Blog.

Estructura principal:

- `app/` - Next.js (App Router)
- `db/` - Drizzle schema y migrations
- `scripts/` - seeds y utilidades para migraciones/seed
- `content/` - MDX para posts de ejemplo (Contentlayer)
- `.env.example` - variables de entorno de ejemplo

## Ejecutar localmente

Requisitos:

- Node 18+ y pnpm
- Una base de datos Postgres accesible para migraciones/seed (opcional si solo usas Contentlayer)

Pasos:

1. Instalar dependencias

```pwsh
cd intranet-scaffold
pnpm install
```

2. Variables de entorno

Copia `.env.example` a `.env.local` y rellena las variables necesarias. Las variables típicas son:

- `SUPABASE_DB_URL` o `DATABASE_URL` — URL de conexión a Postgres/Supabase
- `SUPABASE_SERVICE_ROLE_KEY` — (solo para despliegues / scripts que requieran privilegios)

3. Aplicar migraciones (requiere DB accesible)

```pwsh
cd intranet-scaffold
pnpm run db:migrate
```

4. Rellenar la base (seed) desde MDX (opcional)

```pwsh
pnpm run db:seed
```

5. Ejecutar en modo desarrollo

```pwsh
pnpm dev
```

Si quieres evitar que Contentlayer genere tipos o muestre advertencias en Windows durante el desarrollo, puedes exportar estas variables de entorno antes de arrancar:

```pwsh
$env:CONTENTLAYER_SKIP_TYPEGEN='1'
$env:CONTENTLAYER_HIDE_WARNING='1'
pnpm dev
```

## Notas sobre Contentlayer y Windows


## Migraciones y seed

- Las migraciones se aplican con `scripts/db/migrate-supabase.ts` que busca el fichero SQL `drizzle/migrations/0001_init.sql`.
- `scripts/db/seed-from-mdx.ts` y `scripts/db/seed-projects.ts` son utilidades para poblar la BBDD a partir del contenido de `content/`.

### Levantar una base local con Docker


Alternativa recomendada (script incluido):

En Windows PowerShell puedes arrancar el dev server del scaffold con el script incluido:

```powershell
cd intranet-scaffold
pnpm dev
```

El script `scripts/dev-no-contentlayer.js` ya establece las variables de entorno necesarias y además activa `SKIP_CONTENTLAYER=1` para evitar que el wrapper `next-contentlayer` se aplique durante el dev local en Windows.

Si prefieres arrancar manualmente desde PowerShell sin el script, exporta estas variables primero:

```powershell
$env:CONTENTLAYER_SKIP_TYPEGEN='1'
$env:CONTENTLAYER_HIDE_WARNING='1'
$env:SKIP_CONTENTLAYER='1'
cd intranet-scaffold
pnpm dev
```

Con esto Next arrancará en un puerto disponible (por defecto 3000; si está ocupado usará otro puerto y lo imprimirá en la terminal).
Incluimos un `docker-compose.yml` para pruebas locales que arranca Postgres.

```pwsh
cd intranet-scaffold
docker compose up -d
```

O usar el helper PowerShell (establece `DATABASE_URL` en la sesión):

```pwsh
cd intranet-scaffold
.\scripts\db\run-local-db.ps1
```

Después de levantar la DB local, puedes ejecutar migraciones y seed:

```pwsh
pnpm run db:migrate
pnpm run db:seed
```


## Desarrollo y testing recomendados

- Usa `pnpm run type-check` para comprobar tipos.
- Considera usar una instancia local de Postgres o Supabase en Docker para ejecutar migraciones y seeds sin afectar entornos remotos.

Si quieres, puedo añadir un script `dev:detach` que arranque Next en background de forma controlada, o preparar un `Makefile`/`tasks.json` para VS Code con las tareas más comunes.

## Panel de administración - Proyectos

La intranet incluye una interfaz básica para gestionar proyectos en `/admin/projects`.

Qué puedes hacer:
- Listar proyectos (consumido desde `/api/projects`).
- Crear un nuevo proyecto (formulario: slug + title) — POST `/api/projects`.
- Editar un proyecto existente — PUT `/api/projects/:id`.
- Borrar un proyecto — DELETE `/api/projects/:id`.

Uso rápido:

1. Abrir el panel en desarrollo:

```pwsh
# dentro de la carpeta intranet-scaffold
pnpm dev
# abrir en el navegador: http://localhost:3000/admin/projects
```

2. Crear: rellena `Slug` y `Title` y pulsa `Create`.
3. Editar: pulsa `Edit` en un proyecto, ajusta campos y pulsa `Update`.
4. Borrar: pulsa `Delete` en un proyecto y confirma.

Notas:
- El panel es un ejemplo mínimo; en producción deberías proteger la ruta con autenticación.
- Si tu entorno no tiene DB, la API `/api/projects` usará la conexión a la base configurada; si prefieres poblar desde MDX, usa `pnpm run db:seed`.

# Intranet scaffold — E2E local quickstart

This README explains how to run the intranet scaffold dev server with an in-memory database for fast local E2E testing, and how to run the supplied Node-based E2E script.

## Why use in-memory DB
- Fast, ephemeral tests that don't require a real Postgres instance.
- Good for CI where you want isolated runs.
- NOTE: data won't persist after the dev process exits.

## Start dev with in-memory DB (PowerShell)

Open a PowerShell and run:

```powershell
cd c:\Users\kiri_\cursor-main\intranet-scaffold
$env:USE_IN_MEMORY_DB='1'
$env:SKIP_CONTENTLAYER='1' # optional: speeds dev start if you don't need contentlayer
$env:PORT='3005'
pnpm dev
```

This will start the Next dev server on port 3005 and configure the project to use an in-memory SQLite DB for tests/migrations (drizzle config uses SQLite in-memory when `USE_IN_MEMORY_DB=1`).

## Run the Node E2E script (in another shell)

```powershell
cd c:\Users\kiri_\cursor-main\intranet-scaffold
$env:PORT='3005'
$env:USE_IN_MEMORY_DB='1'
node scripts/e2e-crud.js
```

The script will wait for `/api/projects` to respond and then perform create/list/update/delete operations against the in-memory DB.

## Revert to Postgres

Unset `USE_IN_MEMORY_DB` and set `DATABASE_URL` or `POSTGRES_URL` before starting `pnpm dev` if you want to connect to a real DB:

```powershell
cd c:\Users\kiri_\cursor-main\intranet-scaffold
Remove-Item Env:\USE_IN_MEMORY_DB
$env:DATABASE_URL='postgres://user:pw@localhost:5432/db'
pnpm dev
```

## Notes and caveats
- `drizzle.config.ts` was updated to emit an SQLite config for `USE_IN_MEMORY_DB=1` and keep the Postgres config otherwise.
- In-memory mode is intended for local/debugging/CI only. For production or persistent testing, use a real Postgres instance.
- If you need a persistent local DB for development, change `drizzle.config.ts` to use a file-based sqlite URL (e.g. `file:./dev.sqlite`).

If you want I can also add an npm script that automates start → wait → e2e → shutdown or integrate this into CI. Which would you prefer next?

