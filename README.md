# Duartec Instalaciones Informáticas

Sitio web profesional y moderno para Duartec (Burgos, España) basado en Next.js 14+, TypeScript y Tailwind CSS.

## Características

- Next.js 14+ (App Router, Server Components)
- TypeScript
- Tailwind CSS
- Contentlayer para MDX
- SEO optimizado (next-seo)
- Testing (Jest, Playwright)

## Estructura del proyecto

Ejemplo de estructura principal:

```text
duartec-web/
├── app/
├── components/
├── content/
├── public/
├── tests/
└── config files...
```

## Tecnologías

- Next.js 14+
- TypeScript
- Tailwind CSS
- Contentlayer
- Jest, Playwright

## Inicio rápido

Requisitos: Node.js 18+, pnpm/npm/yarn, Git.

Instalación básica:

```bash
git clone https://github.com/duartec/duartec-web.git
cd duartec-web
pnpm install
pnpm dev
```

Abrir en: [http://localhost:3000](http://localhost:3000)

## Scripts útiles

```bash
pnpm dev
pnpm build
pnpm start
pnpm test
pnpm test:e2e
pnpm lint
pnpm type-check
```

## Gestión de contenido

Los servicios se gestionan en MDX dentro de `content/servicios/`. Mantén el frontmatter consistente para Contentlayer.

## Contribuir

1. Fork
2. git checkout -b feature/X
3. Commit y push
4. Abrir PR

## Contacto

Duartec Instalaciones Informáticas — info@duartec.es — [https://www.duartec.es](https://www.duartec.es)
