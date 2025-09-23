## Propósito

Instrucciones breves y accionables para agentes de IA que trabajen en este repositorio.

## Visión general (big picture)

- Aplicación Next.js 15+ (App Router, Server Components) con TypeScript y Tailwind CSS.
- Contenido editorial en `content/` procesado por Contentlayer; tipos generados en `/.contentlayer/generated`.
- Base de datos con Drizzle ORM y Postgres (Neon); migraciones en `drizzle/`.
- Autenticación con Stack Auth (migrado recientemente desde Clerk).
- Pipeline complejo de generación de contenido con herramientas Python en `tools/`.
- Testing E2E con Playwright usando `intranet-scaffold/` para entorno reproducible.

## Flujos críticos y comandos (ejemplos)

Instalación y desarrollo (requerido: Node 22, pnpm 9.6):

```powershell
pnpm install
pnpm dev    # arranca next en dev
pnpm build  # build de producción (incluye migraciones DB)
```

Testing y CI:

```powershell
pnpm test        # unit (Jest/Vitest)
pnpm test:e2e    # e2e (Playwright) - usa intranet-scaffold webServer
pnpm type-check  # verificación TypeScript
pnpm lint        # ESLint
```

Base de datos / Drizzle:

```powershell
pnpm db:generate   # drizzle-kit generate
pnpm db:migrate    # ejecutar migraciones
pnpm db:seed       # poblar datos desde MDX
```

Generación de contenido e imágenes:

```powershell
pnpm images:generate    # generar imágenes faltantes
pnpm images:ai          # generar imágenes con IA
pnpm gen:article        # generar artículo completo
pnpm validate:mdx       # validar frontmatter MDX
```

## Convenciones y peculariedades del proyecto

- **Gestor de paquetes**: `pnpm` (versión fijada en `package.json`). Evitar `npm` o `yarn` cuando modifiques lockfiles.
- **Contentlayer**: Desactivable con `SKIP_CONTENTLAYER=1` — esencial en Windows para desarrollo y tests.
- **Build personalizado**: `scripts/build.js` maneja variables de entorno automáticamente (desactiva DB/Contentlayer en local Windows).
- **Autenticación**: Stack Auth con `StackProvider` en `app/layout.tsx` y `stackMiddleware` en `middleware.ts`.
- **Imágenes**: Pipeline automatizado genera hero images en `/images/blog/<slug>/<slug>-hero-001.webp`.
- **DB seeding**: Contenido MDX se sincroniza automáticamente a la base de datos via `pnpm db:seed`.
- **React StrictMode**: Desactivado por mapas cliente (Leaflet) — no revertir sin probar.

## Tests e2e / entorno reproducible

- Playwright usa `intranet-scaffold/` como webServer con configuración especial:
  - `USE_IN_MEMORY_DB=1` (evita dependencias externas)
  - `SKIP_CONTENTLAYER=1` (saltea Contentlayer)
  - `INTRANET_DEBUG_TOKEN` (token de ejemplo)
- Ejecutar `pnpm test:e2e` localmente; el proceso reusa servidor cuando es posible.
- Tests unitarios en `__tests__/` con Jest.

## Contenido (MDX) y frontmatter

- Archivos en `content/` alimentan Contentlayer. Frontmatter debe ser compatible o rompe la generación.
- Ejecutar `pnpm validate:mdx` y revisar `scripts/validate-mdx-frontmatter.cjs` si hay errores.
- Tests relacionados: `__tests__/frontmatter_images.test.ts` valida imágenes referenciadas.
- Generación automática: `tools/generate_article.py` crea MDX completo con frontmatter y rutas de imagen predefinidas.

## Integraciones y despliegue

- **Vercel**: `next.config.mjs` habilita `output: 'standalone'` cuando `VERCEL` o `ENABLE_STANDALONE` están activos.
- **Variables de entorno críticas**:
  - `STACK_*` (autenticación Stack Auth)
  - `POSTGRES_URL` / `DATABASE_URL` (Neon)
  - `SKIP_CONTENTLAYER`, `USE_IN_MEMORY_DB`, `VERCEL`
- **GitHub Actions**: Genera imágenes automáticamente en CI/CD.

## Cómo editar código de forma segura (reglas prácticas para el agente)

- **Antes de cambiar DB/Esquema**: Actualizar `db/schema.ts`, ejecutar `pnpm db:generate`, documentar migración en `drizzle/`.
- **Cambios en contenido MDX**: Mantener frontmatter compatible, ejecutar `pnpm validate:mdx` y `pnpm build`.
- **Cambios que afecten imágenes**: Usar `pnpm images:generate` y revisar `tools/` y `scripts/generate_missing_images_runner.js`.
- **Autenticación**: Usar Stack Auth APIs (`stackServerApp.getUser()`, `stackServerApp.getAccessToken()`).
- **Dependencias**: Respetar `pnpm` y `pnpm.overrides` en `package.json`. Evitar duplicados.
- **Build/Deploy**: Probar con `SKIP_CONTENTLAYER=1` en Windows, verificar con `pnpm build` antes de push.

## Archivos clave para referencia rápida

- `package.json` (scripts y dependencias)
- `next.config.mjs` (Contentlayer toggles, imágenes, headers)
- `app/layout.tsx` (StackProvider configuración)
- `middleware.ts` (stackMiddleware)
- `db/schema.ts` (esquema Drizzle)
- `drizzle.config.ts`, `scripts/db/*` (DB)
- `playwright.config.ts` y `intranet-scaffold/` (e2e)
- `tools/generate_*.py` (generación de contenido)
- `scripts/validate-mdx-frontmatter.cjs` (validación MDX)
- `__tests__/frontmatter_images.test.ts` (tests de imágenes)
