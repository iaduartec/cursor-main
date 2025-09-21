# Configuración de Base de Datos

## Supabase (optimizado para Vercel)

### Resumen

- Motor: Supabase Postgres (ideal si necesitas Auth, Storage o Realtime).
- Esquema gestionado con Drizzle (`db/schema.ts`).
- Migraciones en `drizzle/` generadas con `drizzle-kit`.
- Scripts de seed disponibles en `scripts/db/` para poblar `posts`, `projects`, `services` y `streams`.

### Variables de entorno principales

- `SUPABASE_DB_URL`: URL de conexión Postgres. Prioritaria en `db/client.ts`.
- `SUPABASE_URL`: URL pública del proyecto para el SDK de Supabase.
- `SUPABASE_SERVICE_ROLE_KEY`: clave de servicio (o `SUPABASE_ANON_KEY` para usos básicos).
- Compatibilidad: `POSTGRES_URL` y `DATABASE_URL` siguen soportadas como alternativas.

### Puesta en marcha local

1. Crea `.env.local` con las variables anteriores.
2. Ejecuta las migraciones:
   ```bash
   pnpm db:migrate
   ```
3. (Opcional) Lanza los scripts de seed:
   ```bash
   pnpm db:seed
   ```

### Migrar datos desde Neon/Vercel Postgres

1. Genera un volcado desde Neon:
   ```bash
   PGSOURCE=<NEON_DATABASE_URL>
   pg_dump --format=custom --no-owner --no-privileges --file=neon_dump.dump "$PGSOURCE"
   ```
2. Restaura en Supabase:
   ```bash
   PGTARGET=<SUPABASE_DB_URL>
   pg_restore --clean --no-owner --no-privileges --dbname="$PGTARGET" neon_dump.dump
   ```
3. Verifica extensiones y permisos tras la importación.

### Notas

- `db/client.ts` prioriza `SUPABASE_DB_URL` e inicializa el SDK de Supabase si las claves están presentes.
- `scripts/db/migrate-supabase.ts` es el camino recomendado para aplicar migraciones en Supabase.

## Neon / Vercel Postgres (compatibilidad)

Aunque Supabase es la opción principal, también puedes usar Neon o Vercel Postgres.

### Variables de entorno

- `POSTGRES_URL`: URL principal de conexión.
- `DATABASE_URL`: fallback genérico.

Ejemplo de `.env.local`:
```bash
POSTGRES_URL="postgresql://user:password@host/database?sslmode=require"
```

### Comandos útiles

```bash
# Generar migraciones
pnpm db:generate

# Aplicar migraciones
pnpm db:migrate

# Ejecutar seeds manualmente
pnpm db:seed
```

> Para entornos locales sin base de datos disponible puedes definir `USE_IN_MEMORY_DB=1` o `SKIP_DB=1` para que la aplicación funcione con datos de Contentlayer.
