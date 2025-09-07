Base de datos en Vercel (Postgres) para artículos del blog

Resumen

- Motor: Vercel Postgres (Neon) con Drizzle ORM.
- Esquema: tabla `posts` con slug único, contenido y metadatos.
- Migraciones: en carpeta `drizzle/` generadas por `drizzle-kit`.
- Seed: script que importa los `.mdx` de `content/blog/` a la base.

Estructura añadida

- `db/schema.ts`: definición de la tabla `posts` (Drizzle).
- `db/client.ts`: cliente Drizzle para Vercel Postgres.
- `drizzle.config.ts`: configuración de `drizzle-kit`.
- `drizzle/`: carpeta donde se generan las migraciones SQL.
- `scripts/db/migrate.ts`: ejecuta migraciones con Drizzle migrator.
- `scripts/db/seed-from-mdx.ts`: importa artículos MDX al `posts`.
- `.env.example`: variables de entorno esperadas.

Scripts disponibles

- `npm run db:generate`: genera migraciones desde el esquema.
- `npm run db:migrate`: aplica migraciones a la BD apuntada por `POSTGRES_URL`.
- `npm run db:seed`: importa artículos de `content/blog/` a la tabla `posts`.

Creación de la base en Vercel (Dashboard)

1) Entra en Vercel > Storage > Postgres > Add.
2) Asocia la base de datos al proyecto de este repo y crea el recurso.
3) Vercel añadirá automáticamente las variables `POSTGRES_*` al proyecto.
4) Opcional (local): ejecuta `vercel env pull .env.local` para traerlas al entorno local, o copia las credenciales al fichero `.env` (usa `.env.example` como guía).

Aplicar migraciones y poblar datos

1) Asegúrate de tener `POSTGRES_URL` en el entorno (local o en Vercel):
   - Local: crea `.env` con `POSTGRES_URL=...` (o usa `.env.local`).
   - En Vercel: ya estará definido tras crear el recurso Postgres.
2) Ejecuta migraciones:
   - Local: `npm run db:migrate`
   - En Vercel (deploy hook/job): añade un paso que ejecute el mismo comando con las vars en entorno.
3) Importa los artículos actuales (opcional):
   - `npm run db:seed`

Notas importantes

- La web actual sigue renderizando desde los `.mdx` vía Contentlayer. El seed permite tener los datos también en BD.
- Si quieres migrar la lectura a BD (API routes/Server Components), puedo añadir servicios y endpoints para usar `db` y `posts` directamente.
- Ajusta permisos y roles del Postgres en Vercel si vas a exponer escritura desde el sitio (p.ej., panel de admin).

