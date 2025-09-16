## Propósito
Instrucciones breves y accionables para agentes de IA que trabajen en este repositorio.

## Visión general (big picture)
- Aplicación Next.js (directorio `app/`) con TypeScript y Tailwind.
- Contenido editorial en `content/` procesado por Contentlayer; tipos generados en `/.contentlayer/generated` (mapeado en `tsconfig.json`).
- Acceso a datos con Drizzle ORM (`db/schema.ts`) y Postgres (Neon); migraciones en `drizzle/`.
- Scripts y utilidades en `scripts/` y `tools/` (p. ej. generación de imágenes, seeds, migraciones).

## Flujos críticos y comandos (ejemplos)
Instalación y desarrollo (requerido: Node 22, pnpm 9.6):

```powershell
pnpm install
pnpm dev    # arranca next en dev
pnpm build  # build de producción
```

Testing y CI:

```powershell
pnpm test        # unit (vitest)
pnpm test:e2e    # e2e (Playwright) - usa intranet-scaffold webServer
```

Base de datos / Drizzle:

```powershell
pnpm db:generate   # drizzle-kit generate
pnpm db:migrate    # ejecutar migraciones
pnpm db:seed       # poblar datos desde MDX
```

Otras tareas frecuentes:

```powershell
pnpm images:generate    # generar imágenes faltantes
pnpm validate:mdx       # validar frontmatter MDX
pnpm lint               # eslint
```

## Convenciones y peculariedades del proyecto
- Gestor de paquetes: `pnpm` (versión fijada en `package.json`). Evitar usar `npm` o `yarn` cuando modifiques lockfiles.
- `next.config.mjs` permite desactivar Contentlayer con `SKIP_CONTENTLAYER=1` — útil en Windows o para tests rápidos.
- `reactStrictMode` está desactivado por una razón conocida: evita doble-mount en mapas cliente (ver `next.config.mjs`). No revertir sin probar maps.
- El build de Next ignora errores de TypeScript y ESLint (`typescript.ignoreBuildErrors: true`, `eslint.ignoreDuringBuilds: true`). Aun así conservar la calidad del código; los checks se ejecutan con `pnpm type-check` y `pnpm lint`.
- `db/client.ts` usa el driver `postgres` (Neon-friendly). En el pasado se intentó `@supabase/postgres-js` como opción dinámica; ese enfoque es legacy en este repo. Comprueba `DB_SETUP.md` para más detalles.

## Tests e2e / entorno reproducible
- Playwright usa `playwright.config.ts` que arranca un servidor con `node intranet-scaffold/scripts/start-next-dev.js` y variables de entorno:
  - `USE_IN_MEMORY_DB=1` (para evitar dependencias externas)
  - `SKIP_CONTENTLAYER=1` (saltear Contentlayer durante e2e)
  - `INTRANET_DEBUG_TOKEN` (token de ejemplo para intranet-scaffold)

Si añades o modificas pruebas e2e, ejecuta `pnpm test:e2e` localmente; el proceso reusa servidor cuando es posible.

## Contenido (MDX) y frontmatter
- Los archivos en `content/` alimentan Contentlayer. Cambios en frontmatter pueden romper la generación. Ejecuta `pnpm validate:mdx` y revisa `scripts/validate-mdx-frontmatter.cjs` si hay errores.
- Hay tests relacionados: `__tests__/frontmatter_images.test.ts` que validan imágenes referenciadas en frontmatter.

## Integraciones y despliegue
- Vercel: `next.config.mjs` habilita `output: 'standalone'` solo cuando `VERCEL` o `ENABLE_STANDALONE` están activos.
 - Variables de entorno críticas:
  - `POSTGRES_URL` / `DATABASE_URL` (primarias)
  - `SUPABASE_DB_URL` (legacy, solo si necesitas compatibilidad con proyectos antiguos)
  - `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_ANON_KEY`
  - `SKIP_CONTENTLAYER`, `USE_IN_MEMORY_DB`, `VERCEL`

## Cómo editar code safely (reglas prácticas para el agente)
- Antes de cambiar DB/Esquema: actualizar `db/schema.ts`, ejecutar `pnpm db:generate` y documentar la migración en `drizzle/`.
- Para cambios en contenido (MDX): mantener frontmatter compatible, ejecutar `pnpm validate:mdx` y luego `pnpm build` para verificar `.contentlayer` generado.
- Para cambios que afecten imágenes: preferir `pnpm images:generate` y revisar `tools/` y `scripts/generate_missing_images_runner.js`.
- Evitar añadir dependencias duplicadas; respeta `pnpm` y `pnpm.overrides` en `package.json`.

## Archivos clave para referencia rápida
- `package.json` (scripts y dependencias)
- `next.config.mjs` (Contentlayer toggles, imágenes, headers)
- `drizzle.config.ts`, `db/schema.ts`, `scripts/db/*` (DB)
- `playwright.config.ts` y `intranet-scaffold/` (e2e)
- `scripts/validate-mdx-frontmatter.cjs` y `__tests__/frontmatter_images.test.ts` (MDX frontmatter)

Si falta algo o quieres que expanda ejemplos concretos (p. ej. flujo de migración completo, fragmentos de frontmatter válidos), dime qué sección prefieres y la detallo.
