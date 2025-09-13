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

