# Duartec Intranet - DB Setup

Este repositorio usa Supabase Postgres y Drizzle ORM.

Variables de entorno necesarias (ejemplo `.env.local`):

```
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


