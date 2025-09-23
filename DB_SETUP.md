# Configuración de base de datos con Neon

La aplicación está pensada para usar **Neon Postgres** (o cualquier Postgres compatible) con Drizzle ORM.

## Variables de entorno imprescindibles

Configura tu `.env.local` con una URL válida de Neon:

```bash
DATABASE_URL="postgresql://<usuario>:<contraseña>@<host>.neon.tech/<db>?sslmode=require"
```

También se aceptan `POSTGRES_URL` o `NEON_DATABASE_URL`. El cliente se inicializa con la primera variable disponible en ese orden.

## Puesta en marcha local

1. Crea `.env.local` con `DATABASE_URL` (y opcionalmente `ENABLE_DB_IN_DEV=1` si quieres forzar el uso de la BD en desarrollo).
2. Aplica migraciones y seeds:

   ```bash
   pnpm run db:migrate
   pnpm run db:seed
   ```

3. Verifica la conexión:

   ```bash
   pnpm exec tsx scripts/db/ping-neon.ts
   pnpm exec tsx scripts/verify-neon.ts
   ```

## Scripts relevantes

- `scripts/db/migrate.ts`: aplica migraciones usando el driver serverless compatible con Neon.
- `scripts/db/migrate-neon.ts`: versión alternativa basada en `drizzle-orm/neon-http` para despliegues serverless puros.
- `scripts/db/migrate-safe.ts`: versión tolerante a errores (con soporte para Neon) pensada para CI.
- `scripts/db/seed-from-mdx.ts`: rellena la tabla `posts` con el contenido del blog.
- `scripts/db/seed-projects.ts`, `scripts/db/seed-services.ts`, `scripts/db/seed-streams.ts`: scripts para poblar el resto de tablas.

## Fallback sin base de datos

En desarrollo, si no defines ninguna URL de Postgres y `ENABLE_DB_IN_DEV` no está activo, la aplicación cae automáticamente a los datos estáticos generados por Contentlayer para evitar fallos.
