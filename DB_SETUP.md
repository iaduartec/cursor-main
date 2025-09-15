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

- Motor: Supabase Postgres (recomendado si quieres integrar Storage/Auth/Realtime).
- Esquema: definido en `db/schema.ts` con Drizzle (pg-core). Funciona en Supabase porque es Postgres.
- Migraciones: en carpeta `drizzle/` generadas por `drizzle-kit`.
- Seed: scripts en `scripts/db/` permiten poblar `posts`, `projects`, `services`, `streams`.

Por qué usar Supabase en Vercel

- Integración sencilla con Auth y Storage (si necesitas subida de imágenes o sesiones).
- Supabase ofrece un panel y roles gestionados; puedes crear una `SERVICE_ROLE` para tareas de migración/seed.
- Para Vercel Serverless, Supabase es una opción madura y bien soportada.

Variables de entorno recomendadas

- `SUPABASE_DB_URL` - URL de conexión Postgres (p. ej. la "Database URL" que provee Supabase). `db/client.ts` la usa con la mayor prioridad.
- `POSTGRES_URL` - alternativa compatible usada por algunos scripts y por `db/client.ts` si `SUPABASE_DB_URL` no está definida.
- `DATABASE_URL` - fallback genérico (por compatibilidad con otras infraestructuras).
- `SUPABASE_URL` - URL pública del proyecto Supabase (para el SDK JS, p. ej. https://xyz.supabase.co).
- `SUPABASE_SERVICE_ROLE_KEY` - clave de servicio (privada) necesaria para tareas administrativas y para inicializar el SDK con privilegios elevados. Guárala en Vercel como Environment Secret.
- `SUPABASE_ANON_KEY` - clave pública/anon para el SDK cuando no se usa la service role. `db/client.ts` acepta `SUPABASE_SERVICE_ROLE_KEY` o `SUPABASE_ANON_KEY` para crear el cliente JS.

Orden de precedencia en `db/client.ts` (qué variable se usa para la conexión SQL):
1. `SUPABASE_DB_URL` (recomendado)
2. `POSTGRES_URL`
3. `DATABASE_URL`

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

- `SUPABASE_DB_URL` = <Database URL from Supabase project>
- `SUPABASE_URL` = <Supabase public URL>
- `SUPABASE_SERVICE_ROLE_KEY` = <Service role key> (marca como Secret)

Comportamiento del SDK y el driver
- El archivo `db/client.ts` intenta usar en runtime el driver `@supabase/postgres-js` (serverless-friendly) mediante `require` dinámico; si no está instalado, hace fallback al paquete `postgres`.
- Por eso el código no falla la instalación si `@supabase/postgres-js` no está en `package.json`. Si prefieres, puedes instalarlo explícitamente y ajustar `package.json` para forzar ese driver.

Variables útiles para debugging
- `NODE_ENV=development` para ejecutar `pnpm dev` localmente.
- `SUPABASE_DB_URL` en una shell temporal para ejecutar scripts puntuales sin `.env.local`, por ejemplo:

```powershell
$env:SUPABASE_DB_URL="postgresql://..."
pnpm exec tsx scripts/db/check-version.ts
```


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

Problema conocido al instalar dependencias

Si al ejecutar `pnpm install` obtienes un error 404 para `@supabase/postgres-js`, prueba lo siguiente:

1) Asegúrate de que `package.json` no contiene `@supabase/postgres-js` (si existe, elimínala).
2) Regenera el lockfile (opción segura):

```powershell
pnpm install --no-frozen-lockfile
```

3) Si el paso 2 falla, elimina el lockfile manualmente y reinstala:

```powershell
# En el directorio del proyecto
Remove-Item pnpm-lock.yaml -Force
pnpm install
```

4) Si aún hay problemas, revisa las entradas en `pnpm-lock.yaml.bak` (si existe) o elimina el backup y vuelve a intentar.

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
# luego: curl http://127.0.0.1:4000/api/db-ping
```

Buenas prácticas y recordatorios

- No comitees credenciales: usa `.env.local` para pruebas locales y configura variables en Vercel para deploy.
- En Vercel, define `SUPABASE_DB_URL`, `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` como Environment Variables (Secret).
- Si Contentlayer da errores de parseo MDX en Windows, revisa los frontmatters de los `.mdx` afectados; son warnings que pueden impedir la generación de `.contentlayer`.

Si quieres, puedo:

1. Cambiar el driver a `@supabase/postgres-js` y ajustar `db/client.ts`.
2. Añadir scripts para automatizar dump/restore entre Neon y Supabase.
3. Crear un pequeño endpoint/Admin para verificar la conexión y mostrar versión de DB.

Dime qué quieres que implemente ahora y lo hago.
Si quieres, puedo:

1. Cambiar el driver a `@supabase/postgres-js` y ajustar `db/client.ts`.
2. Añadir scripts para automatizar dump/restore entre Neon y Supabase.
3. Crear un pequeño endpoint/Admin para verificar la conexión y mostrar versión de DB.

Dime qué quieres que implemente ahora y lo hago.

