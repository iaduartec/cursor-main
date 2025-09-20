# Configuración de Base de Datos - Neon/Postgres

<!-- Resumen generado automáticamente -->
Configuración de base de datos con Neon/Vercel Postgres

## Resumen

- **Motor**: Postgres (Neon/Vercel) - Optimizado para serverless
- **ORM**: Drizzle con driver `postgres` (Neon-friendly)
- **Esquema**: Definido en `db/schema.ts` con Drizzle (pg-core)
- **Migraciones**: En carpeta `drizzle/` generadas por `drizzle-kit`
- **Seed**: Scripts en `scripts/db/` para poblar datos

## Variables de Entorno Recomendadas

- `POSTGRES_URL` - URL de conexión principal (recomendado)
- `DATABASE_URL` - Fallback genérico para compatibilidad

## Orden de Precedencia en `db/client.ts`

1. `POSTGRES_URL` (recomendado)
2. `DATABASE_URL`

## Configuración Local (.env.local)

```bash
# URL de conexión principal
POSTGRES_URL="postgresql://user:password@host/database?sslmode=require"
```

## Configuración en Vercel

En Settings > Environment Variables:

- `POSTGRES_URL` = `postgresql://<DB_USER>:<DB_PASS>@<HOST>:5432/<DB_NAME>`

## Comandos de Base de Datos

```bash
# Generar migraciones
pnpm db:generate

# Aplicar migraciones
pnpm db:migrate

# Poblar datos iniciales
pnpm db:seed

# Poblar datos específicos
pnpm db:seed:projects
pnpm db:seed:services
pnpm db:seed:streams
```

## Scripts de Verificación

```bash
# Verificar versión de Postgres
pnpm exec tsx scripts/db/check-version.ts

# Verificar conexión
pnpm exec tsx scripts/db/check-env.ts
```

## Notas de Seguridad

- Nunca commitear credenciales en el repositorio
- Usar `.env.local` para desarrollo local
- Configurar variables de entorno en Vercel para producción
- El proyecto usa el driver `postgres` que es compatible con Neon

## Troubleshooting

### Error de conexión
- Verificar que `POSTGRES_URL` esté configurada correctamente
- Asegurarse de que la base de datos esté accesible desde el entorno

### Error en migraciones
- Ejecutar `pnpm db:generate` antes de `pnpm db:migrate`
- Verificar que el esquema en `db/schema.ts` sea válido

### Problemas con dependencias
- El proyecto evita dependencias opcionales en runtime
- Si hay problemas con el lockfile, eliminar `pnpm-lock.yaml` y ejecutar `pnpm install`

## Migración de Datos

Si necesitas migrar datos desde otra base de datos Postgres:

1. Hacer dump de la base de datos origen
2. Configurar la nueva base de datos en Neon/Vercel
3. Restaurar el dump en la nueva base de datos
4. Ejecutar migraciones y seed si es necesario

### Comandos de migración

```bash
# Dump desde base de datos origen
pg_dump --format=custom --no-owner --no-privileges \
  --file=dump.dump "postgresql://user:pass@host/db"

# Restore en nueva base de datos
pg_restore --clean --no-owner --no-privileges \
  --dbname="postgresql://user:pass@host/db" dump.dump
```

## Pruebas y Verificación

1. Configurar `.env.local` con `POSTGRES_URL`
2. Ejecutar comandos de verificación:

```bash
pnpm db:migrate
pnpm db:seed
pnpm test
```

## Buenas Prácticas

- No commitear credenciales en el repositorio
- Usar `.env.local` para desarrollo local
- Configurar variables de entorno en Vercel para producción
- El proyecto usa driver `postgres` compatible con Neon
- Mantener esquema de base de datos actualizado con `db/schema.ts`
