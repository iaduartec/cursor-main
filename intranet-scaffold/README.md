# Duartec Intranet (Scaffold)

Scaffold inicial para la intranet: admin CRUD para Servicios, Proyectos, Streaming y Blog.

Estructura inicial:

- app/ - Next.js  app router
- db/ - Drizzle schema y migraciones
- scripts/ - seeds y utilidades
- .env.local - variables privadas

Siguientes pasos:

1. Rellenar `db/schema.ts` con las tablas `projects`, `services`, `streams`, `posts`.
2. Añadir páginas admin en `app/admin`.
3. Configurar Supabase en Vercel con `SUPABASE_DB_URL` y `SUPABASE_SERVICE_ROLE_KEY`.

