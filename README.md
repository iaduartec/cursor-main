# Duartec Web

Sitio web profesional de **Duartec Instalaciones Informáticas**:
soluciones integrales en informática, videovigilancia, sonido y electricidad
en Burgos.

## 🚀 Tecnologías principales

- [Next.js](https://nextjs.org/) **15.5.3** (con soporte para TypeScript)
- [React](https://reactjs.org/) **19.1.1** (última versión)
- [Tailwind CSS](https://tailwindcss.com/) **4.1.13** (última versión)
- [Drizzle ORM](https://orm.drizzle.team/) **0.44.5** + Neon/Postgres
- [Contentlayer](https://www.contentlayer.dev/) **0.3.4**
- [Playwright](https://playwright.dev/) y [Vitest](https://vitest.dev/)
  para testing
- [ESLint](https://eslint.org/) **9.35.0** + [Prettier](https://prettier.io/)
  para linting y formato

## 📦 Requisitos previos

- **Node.js** `>=24.0.0` (LTS más reciente)
- **pnpm** `10.x` (última versión estable)

> ⚠️ **Importante**: El proyecto incluye un script de guardia que bloquea versiones antiguas de Node.js (<24.x) y pnpm (!=10.x) para asegurar consistencia.

## 🔧 Instalación

Clona el repositorio y ejecuta:

```bash
pnpm install
```

El script de preinstall validará automáticamente las versiones de Node.js y pnpm.

## 📜 Scripts disponibles

### Desarrollo

- `pnpm dev` - Entorno de desarrollo con Next.js
- `pnpm build` - Genera build de producción
- `pnpm start` - Inicia el servidor en producción

### Calidad de código

- `pnpm lint` - Revisa errores de linting
- `pnpm lint:fix` - Corrige errores de linting automáticamente
- `pnpm format` - Formatea el código con Prettier
- `pnpm type-check` - Verifica tipos TypeScript

### Testing

- `pnpm test` - Ejecuta tests unitarios con Vitest
- `pnpm test:e2e` - Ejecuta tests end-to-end con Playwright

### Base de datos

- `pnpm db:generate` - Genera migraciones con Drizzle
- `pnpm db:migrate` - Ejecuta migraciones de base de datos
- `pnpm db:seed` - Pobla datos iniciales
- `pnpm db:seed:projects` - Pobla datos de proyectos
- `pnpm db:seed:services` - Pobla datos de servicios
- `pnpm db:seed:streams` - Pobla datos de streams

### Utilidades

- `pnpm images:generate` - Genera imágenes faltantes
- `pnpm images:check` - Verifica imágenes faltantes
- `pnpm validate:mdx` - Valida frontmatter de archivos MDX

👉 Para ver todos los scripts disponibles, revisa el `package.json`.

## 🌍 SEO y Analytics

- Configuración SEO con [`next-seo`](https://github.com/garmeeh/next-seo)
- Sitemap automático con [`next-sitemap`](https://www.npmjs.com/package/next-sitemap)
- Métricas con [`@vercel/analytics`](https://vercel.com/docs/concepts/analytics)
- Speed Insights con [`@vercel/speed-insights`](https://vercel.com/docs/concepts/speed-insights)

## 🧪 Testing

- **Unit testing** con Vitest (reemplaza Jest)
- **End-to-End testing** con Playwright
- **Intranet** con pruebas e2e dedicadas (`intranet-scaffold`)

## �️ Base de datos

- **Proveedor**: Neon (Vercel Postgres)
- **ORM**: Drizzle con driver `postgres` (Neon-friendly)
- **Esquema**: Definido en `db/schema.ts`
- **Migraciones**: En carpeta `drizzle/`

### Variables de entorno requeridas

```bash
# Conexión principal
POSTGRES_URL="postgresql://user:password@host/database?sslmode=require"

# Fallback
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"
```

## �📂 Estructura básica (resumida)

```text
/scripts             → Scripts de automatización y validación
/tools               → Utilidades (generación de imágenes, artículos, etc.)
/intranet-scaffold   → Submódulo para pruebas y demo CRUD
/content             → Contenido MDX procesado por Contentlayer
/db                  → Configuración de base de datos y esquemas
```

## 🚀 Despliegue en Vercel

### Configuración automática

El proyecto está optimizado para despliegue en Vercel con:

- **Región**: `fra1` (Frankfurt)
- **Node.js**: `>=24.0.0`
- **Build Command**: `pnpm build`
- **Install Command**: `pnpm install --frozen-lockfile`

### Variables de entorno en Vercel

```bash
# Base de datos
POSTGRES_URL=postgresql://user:pass@host/db?sslmode=require

# Next.js
NODE_ENV=production

# Contentlayer (opcional para desarrollo)
SKIP_CONTENTLAYER=1
```

### Headers de seguridad incluidos

- Strict-Transport-Security
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy
- Permissions-Policy

## 📄 Licencia

Este proyecto está bajo licencia **MIT**.
Consulta el archivo [LICENSE](./LICENSE) para más detalles.
