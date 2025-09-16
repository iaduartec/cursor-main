# Duartec Web

Sitio web profesional de **Duartec Instalaciones Informáticas**: soluciones integrales en informática, videovigilancia, sonido y electricidad en Burgos.

## 🚀 Tecnologías principales
- [Next.js](https://nextjs.org/) (con soporte para TypeScript)
- [Tailwind CSS](https://tailwindcss.com/)
- [Drizzle ORM](https://orm.drizzle.team/) + Neon/Postgres
- [Contentlayer](https://www.contentlayer.dev/)
- [Playwright](https://playwright.dev/) y [Jest](https://jestjs.io/) para testing
- [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/) para linting y formato

## 📦 Requisitos previos
- **Node.js** `22.x`
- **pnpm** `9.6.0` (gestor de paquetes)

## 🔧 Instalación
Clona el repositorio y ejecuta:

```bash
pnpm install
```

## 📜 Scripts disponibles

| Script                 | Descripción                                                    |
| ---------------------- | -------------------------------------------------------------- |
| `pnpm dev`             | Entorno de desarrollo con Next.js                              |
| `pnpm build`           | Genera build de producción                                     |
| `pnpm start`           | Inicia el servidor en producción                               |
| `pnpm lint`            | Revisa errores de linting                                      |
| `pnpm lint:fix`        | Corrige errores de linting automáticamente                     |
| `pnpm test`            | Ejecuta tests unitarios con Jest                               |
| `pnpm test:e2e`        | Ejecuta tests end-to-end con Playwright                        |
| `pnpm format`          | Formatea el código con Prettier                                |
| `pnpm db:migrate`      | Ejecuta migraciones de base de datos (Neon/Postgres + Drizzle) |
| `pnpm images:generate` | Genera imágenes faltantes                                      |
| `pnpm git:pull`        | Actualiza el repositorio con script interno                    |

👉 Para ver todos los scripts disponibles, revisa el `package.json`.

## 🌍 SEO y Analytics

* Configuración SEO con [`next-seo`](https://github.com/garmeeh/next-seo)
* Sitemap automático con [`next-sitemap`](https://www.npmjs.com/package/next-sitemap)
* Métricas con [`@vercel/analytics`](https://vercel.com/docs/concepts/analytics)

## 🧪 Testing

* **Unit testing** con Jest
* **End-to-End testing** con Playwright
* **Intranet** con pruebas e2e dedicadas (`intranet-scaffold`)

## 📂 Estructura básica (resumida)

```
/scripts             → Scripts de automatización
/tools               → Utilidades (generación de imágenes, artículos, etc.)
/intranet-scaffold   → Submódulo para pruebas y demo CRUD
```

## 📄 Licencia

Este proyecto está bajo licencia **MIT**.
Consulta el archivo [LICENSE](./LICENSE) para más detalles.
