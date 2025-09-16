<!--
Resumen generado automáticamente.

intranet-scaffold/DB_SETUP.md

2025-09-13T06:20:07.372Z

——————————————————————————————
Archivo .md: DB_SETUP.md
Tamaño: 530 caracteres, 30 líneas
Resumen básico generado automáticamente sin análisis de IA.
Contenido detectado basado en extensión y estructura básica.
-->
# Duartec Intranet - DB Setup

Este repositorio usa Neon/Postgres (compatible con Supabase) y Drizzle ORM.

Variables de entorno necesarias (ejemplo `.env.local`):

```bash
# Prefer POSTGRES_URL / DATABASE_URL for Neon/Postgres
POSTGRES_URL=postgresql://user:password@db.host:5432/postgres
# Supabase-specific variables (opcional / legacy)
SUPABASE_DB_URL=postgresql://user:password@db.supabase.co:5432/postgres
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ENABLE_DB_IN_DEV=1
```

Comandos útiles:

- Ejecutar migraciones (local):

```powershell
pnpm install
pnpm run db:migrate
```

- Ejecutar seed desde MDX:

```powershell
pnpm exec tsx scripts/db/seed-projects.ts
```
