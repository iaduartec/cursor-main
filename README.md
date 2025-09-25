Duartec Instalaciones Informáticas

Sitio web profesional para Duartec (Burgos, España) con Next.js 14+, TypeScript y Tailwind CSS. Contenido en MDX con Contentlayer, SEO cuidado y pruebas unitarias/E2E.

Características

App Router (RSC, rutas anidadas, layouts).

Type-safe: TS en todo el proyecto.

UI: Tailwind + componentes reutilizables.

Contenido: MDX con Contentlayer (tipado automático).

SEO: next-seo + next-sitemap.

Testing: Jest (unit) + Playwright (E2E).

Listo para Vercel (ISR/SSG, imágenes optimizadas).

Estructura del proyecto
duartec-web/
├── app/                  # Rutas (App Router)
│   ├── layout.tsx
│   ├── page.tsx
│   └── (marketing)/...
├── components/           # UI y bloques de página
├── content/              # MDX (servicios, casos, blog)
│   ├── servicios/
│   ├── casos/
│   └── blog/
├── public/               # estáticos (favicons, imágenes)
├── styles/               # globals.css, tailwind.css
├── tests/                # unit + e2e
├── contentlayer.config.ts
├── next-seo.config.ts
├── next-sitemap.config.cjs
└── package.json

Requisitos

Node.js 18+

pnpm (o npm/yarn)

Git

Inicio rápido
git clone https://github.com/duartec/duartec-web.git
cd duartec-web
pnpm install
cp .env.example .env.local
pnpm dev


Abre: http://localhost:3000

Variables de entorno

Crea .env.local desde el ejemplo:

# SEO/Analytics (opcional)
NEXT_PUBLIC_SITE_URL=https://www.duartec.es
NEXT_PUBLIC_SITE_NAME=Duartec Instalaciones Informáticas
NEXT_PUBLIC_GA_ID=

# Playwright (opcional)
BASE_URL=http://localhost:3000


Nota: NEXT_PUBLIC_SITE_URL se usa para next-sitemap y metadatos.

Scripts
pnpm dev           # Desarrollo
pnpm build         # Compilación (incluye type-check)
pnpm start         # Producción local
pnpm lint          # ESLint
pnpm type-check    # tsc --noEmit
pnpm test          # Unit con Jest
pnpm test:e2e      # E2E con Playwright
pnpm format        # Prettier


Tras pnpm build, se ejecuta postbuild para generar sitemap y robots vía next-sitemap.config.cjs.

Contentlayer + MDX

contentlayer.config.ts (ejemplo mínimo de “servicio”):

import { defineDocumentType, makeSource } from 'contentlayer/source-files'

export const Servicio = defineDocumentType(() => ({
  name: 'Servicio',
  filePathPattern: `servicios/**/*.mdx`,
  fields: {
    title: { type: 'string', required: true },
    slug: { type: 'string', required: true },
    summary: { type: 'string', required: true },
    order: { type: 'number', required: false },
    published: { type: 'boolean', default: true },
  },
  computedFields: {
    url: { type: 'string', resolve: (doc) => `/servicios/${doc.slug}` },
  },
}))

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [Servicio],
  mdx: {},
})


MDX de ejemplo → content/servicios/videovigilancia-ip.mdx:

---
title: Videovigilancia IP
slug: videovigilancia-ip
summary: Cámaras IP, NVR, acceso remoto y mantenimiento.
order: 1
published: true
---

<Feature title="Monitorización remota">
  Acceso seguro desde móvil y escritorio, alertas y grabación.
</Feature>


En una página del app/:

import { allServicios } from 'contentlayer/generated'

export default async function ServiciosPage() {
  const servicios = allServicios.filter(s => s.published).sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  return (
    <section className="grid gap-6 md:grid-cols-2">
      {servicios.map(s => (
        <article key={s.slug} className="p-6 rounded-2xl border">
          <h2 className="text-xl font-semibold">{s.title}</h2>
          <p className="text-sm opacity-80">{s.summary}</p>
          <a className="mt-3 inline-block underline" href={s.url}>Ver servicio</a>
        </article>
      ))}
    </section>
  )
}

SEO

next-seo.config.ts (básico):

import { DefaultSeoProps } from 'next-seo'

const config: DefaultSeoProps = {
  titleTemplate: '%s | Duartec',
  defaultTitle: 'Duartec Instalaciones Informáticas',
  description: 'Instalación y mantenimiento de informática, videovigilancia, sonido y cableados en Burgos.',
  openGraph: {
    type: 'website',
    siteName: 'Duartec',
    url: process.env.NEXT_PUBLIC_SITE_URL,
  },
  twitter: { cardType: 'summary_large_image' },
}
export default config


next-sitemap.config.cjs:

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.duartec.es',
  generateRobotsTxt: true,
  robotsTxtOptions: { policies: [{ userAgent: '*', allow: '/' }] },
}

Testing

Unit (Jest): componentes y utilidades.
E2E (Playwright): rutas públicas y formularios.

pnpm test       # unit
pnpm test:e2e   # e2e


Ejemplo Playwright (tests/e2e/home.spec.ts):

import { test, expect } from '@playwright/test'

test('home carga y muestra título', async ({ page }) => {
  await page.goto(process.env.BASE_URL || 'http://localhost:3000')
  await expect(page.getByRole('heading', { name: /duartec/i })).toBeVisible()
})

Despliegue

Vercel recomendado (importar repo, variables en proyecto).

Alternativa: Docker / Node en server propio.

Checklist Vercel:

Framework: Next.js.

Build Command: pnpm build.

Output: .next.

Env: set NEXT_PUBLIC_SITE_URL.

Contribuir

git checkout -b feature/<nombre>

pnpm lint && pnpm test

Commit con mensaje claro (opcional: convencional).

Pull Request.

Licencia

Propietaria (Duartec). Solicitar permiso antes de reutilizar.

Contacto

Correo: info@duartec.es

Web: https://www.duartec.es