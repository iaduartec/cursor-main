<!--
Resumen generado automáticamente.

DEV_NOTES.md

2025-09-13T06:20:07.355Z

——————————————————————————————
Archivo .md: DEV_NOTES.md
Tamaño: 2403 caracteres, 54 líneas
Resumen básico generado automáticamente sin análisis de IA.
Contenido detectado basado en extensión y estructura básica.
-->
Desarrollo y despliegue: Node 22, DB y standalone

Resumen rápido

- Node: 22.x (ver `engines.node` y `.node-version`).
- Gestor de paquetes: pnpm (ver `packageManager`). Usa `pnpm install`/`pnpm run`.
- Standalone: desactivado por defecto en local Windows (para evitar symlinks). En Vercel se activa automáticamente.
- BD: Postgres (Neon/Vercel) con Drizzle ORM. Usa `POSTGRES_URL` o `POSTGRES_URL_NON_POOLING`.
- Admin: panel en `/admin` protegido por token (`ADMIN_TOKEN`).

Standalone (Next.js)

- `next.config.mjs` activa `output: 'standalone'` solo si:
  - `VERCEL=1` (deploy en Vercel), o
  - `ENABLE_STANDALONE=1` (forzar local).
- Motivo: en Windows el build standalone puede fallar por symlinks (EPERM). Para probarlo local, ejecuta:
  - PowerShell: `$env:ENABLE_STANDALONE='1'; npm run build`

Base de datos (Drizzle + Postgres)

- Variables soportadas: `POSTGRES_URL` (pooled), `POSTGRES_URL_NON_POOLING` (directa), `DATABASE_URL` (fallback).
- Cliente: `db/client.ts` usa `pg` Pool (válido en local y Vercel) — no requiere `@vercel/postgres`.
- Migraciones: `npm run db:migrate` (lee `.env.local` si existe).
- Seeds: `npm run db:seed` (blog desde MDX), `npm run db:seed:streams` (cámaras iniciales).

Admin y API

- `ADMIN_TOKEN`: añade en `.env.local` y en Vercel. Protege `/admin` (middleware) y las mutaciones de `/api/streams`.
- Login admin: `/admin/login` (guarda cookie `admin` si el token es válido).
- Endpoints Streams:
  - GET `/api/streams`, GET `/api/streams/[slug]` (públicos).
  - POST `/api/streams`, PATCH/DELETE `/api/streams/[slug]` (con `Authorization: Bearer <ADMIN_TOKEN>`).
- Revalidación: al mutar streams, se invalida la tag `streams` para refrescar `/streaming`.

Contenido desde BD

- Blog: listado y detalle leen desde `posts` (fallback a Contentlayer si no hay BD).
- Streaming: listado (`/streaming`) y detalle (`/streaming/[slug]`) desde `streams`.
- Servicios/Proyectos: CRUD en admin listo; si quieres, puedo migrar sus páginas públicas para leer desde BD.

Avisos y advertencias conocidas (seguras)

- Contentlayer en Windows muestra warnings, pero el build funciona.
- OTel puede mostrar “Critical dependency” en dev/build; es ruido por detección dinámica.

Comandos útiles

- Desarrollo: `pnpm dev`
 - Desarrollo (ligero, sin Contentlayer): `pnpm dev:light`  # equivalente a SKIP_CONTENTLAYER=1
   - Alternativa: `cross-env SKIP_CONTENTLAYER=1 pnpm dev`
- Ejecutar Playwright condicionalmente: `pnpm test:e2e:maybe` (usa SKIP_PLAYWRIGHT=1 para omitir)
- Omitir Playwright: `cross-env SKIP_PLAYWRIGHT=1 pnpm test:e2e:maybe`
- Build prod: `pnpm build`
- Type-check: `pnpm type-check`
- Migraciones: `pnpm db:migrate`
- Seed blog/streams: `pnpm db:seed` / `pnpm db:seed:streams`

## Operación de squash + backup (historial sobrescrito)

- Fecha: 2025-09-13T
- Acción: Se creó una rama de respaldo `main-backup-<timestamp>` y se generó un commit único (squash) con el estado actual del árbol de `main`.
- Resultado: Se forzó `git push --force origin main` local -> remoto. El historial remoto fue reemplazado por el nuevo commit squasheado.
- Notas: Si necesitas recuperar el historial completo, restaura desde la rama `main-backup-<timestamp>` disponible en el repositorio remoto.

