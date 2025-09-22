# Notas de desarrollo y despliegue

## Entorno base

- **Node.js**: 22.x (`package.json` y `.node-version`).
- **Gestor de paquetes**: pnpm (`packageManager`). Usa `pnpm install` / `pnpm run`.
- **Panel de administración**: `/admin` protegido por `ADMIN_TOKEN` (middleware y endpoints).

## Salida standalone

- `next.config.mjs` activa `output: 'standalone'` cuando `VERCEL=1` o `ENABLE_STANDALONE=1`, excepto en Windows local donde se desactiva por defecto para evitar EPERM de symlink.
- En Windows pueden aparecer errores de permisos con symlinks; para probar localmente forzando standalone:

  ```powershell
  $env:ENABLE_STANDALONE='1'; pnpm build
  ```

## Base de datos (Drizzle + Postgres)

- Variables soportadas por `db/client.ts`:
  - `POSTGRES_URL`, `POSTGRES_URL_NON_POOLING`, `DATABASE_URL`, `NEON_DATABASE_URL`.
  - Prefijos `cxz_…` siguen siendo válidos para entornos locales.
- El cliente usa el driver serverless de Neon (con fallback en memoria si `USE_IN_MEMORY_DB=1` o `SKIP_DB=1`).
- Migraciones:

  ```bash
  pnpm db:migrate
  ```

- Seeds disponibles:

  ```bash
  pnpm db:seed          # blog + proyectos básicos
  pnpm db:seed:streams  # cámaras iniciales
  pnpm db:seed:services # servicios
  ```

## Contenido

- **Blog**: listado y detalle desde `posts` (fallback a Contentlayer si no hay DB).
- **Streaming**: `/streaming` y `/streaming/[slug]` consultan la tabla `streams`.
- **Servicios y proyectos**: CRUD en admin listo; las páginas públicas pueden consultar DB cuando esté disponible.

## API y administración

- Endpoints públicos: `GET /api/streams`, `GET /api/streams/[slug]`.
- Endpoints protegidos (`Authorization: Bearer <ADMIN_TOKEN>`): `POST /api/streams`, `PATCH/DELETE /api/streams/[slug]`.
- Revalidación automática de la etiqueta `streams` tras mutaciones.

## Comandos útiles

```bash
pnpm dev             # desarrollo normal
pnpm build           # build de producción
pnpm type-check      # verificación de tipos
pnpm test            # tests unitarios
pnpm test:e2e        # e2e con Playwright (requiere dependencias)
```

### Variantes

- `pnpm dev --filter !contentlayer` o `SKIP_CONTENTLAYER=1 pnpm dev` para saltar la generación de contenido.
- Usa `USE_IN_MEMORY_DB=1` para evitar conexiones reales durante pruebas locales.

## Logs y advertencias conocidas

- Contentlayer puede emitir advertencias en Windows, pero el build es válido.
- La instrumentación de OpenTelemetry puede registrar "Critical dependency" durante compilación; es ruido.

### Advertencias de dependencias (dev-only)

- Durante la auditoría y el build hemos visto advertencias sobre subdependencias de desarrollo:
  - `@esbuild-kit/core-utils@3.3.2`
  - `@esbuild-kit/esm-loader@2.6.5`
  - `node-domexception@2.0.2`

- Causa: estas dependencias son transitivas y provienen de herramientas de desarrollo:
  - `@esbuild-kit/*` es requerido por `drizzle-kit` (devDependency) y otras utilidades de build.
  - `node-domexception` aparece en la cadena `contentlayer` → `mdx-bundler` → `@mdx-js/esbuild` (uso en tiempo de build de MDX).

- Impacto: son advertencias deprecadas (warnings) y, en la configuración actual del proyecto, **no afectan al runtime en producción** porque entran por herramientas dev/build. No obstante, conviene seguirlas y arreglarlas upstream a medio plazo.

- Acciones tomadas aquí:
  1. Se añadieron overrides puntuales para parchear vulnerabilidades activas detectadas por `pnpm audit` (ej. `path-to-regexp`, `cookie`).
 2. Se intentó actualizar las dependencias que las traen; las versiones problemáticas siguen siendo las publicadas actualmente.

- Recomendaciones:
  - Estrategia a corto plazo: aceptar y documentar estas advertencias (seguro y no intrusivo).
  - Estrategia a medio/largo plazo: abrir issues o PRs upstream en `drizzle-kit` y `contentlayer` solicitando actualización de sus dependencias transitorias. Esto es la solución correcta y duradera.
  - Evitar forzar overrides de versiones que no existen o que no son compatibles (puede romper builds).

Si quieres, puedo preparar los textos para los issues/PRs o abrirlos desde tu cuenta si me das permiso.

## Historia reciente

- Se consolidó el historial en 2025-09-13 mediante squash conservando una copia `main-backup-<timestamp>`.
- Se añadieron configuraciones PostCSS específicas (`intranet-scaffold/postcss.config.cjs`) para evitar errores ESM/CJS en Windows.
- Scripts de debug en `intranet-scaffold/scripts/` permiten arrancar Next con `USE_IN_MEMORY_DB=1` y realizar comprobaciones automáticas.

> Consejo: mantén `.env.local` sincronizado con las variables configuradas en Vercel para reproducir el entorno de producción.
