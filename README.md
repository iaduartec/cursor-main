<!--
Resumen generado automáticamente.

README.md

2025-09-13T06:20:07.356Z

——————————————————————————————
Archivo .md: README.md
Tamaño: 7951 caracteres, 343 líneas
Resumen básico generado automáticamente sin análisis de IA.
Contenido detectado basado en extensión y estructura básica.
-->
# Duartec Instalaciones Informáticas

Sitio web profesional y moderno para Duartec (Burgos, España) basado en Next.js 14+, TypeScript, Tailwind CSS y las mejores prácticas de desarrollo web.

## 🚀 Características

- **Next.js 14+** con App Router y Server Components
- **TypeScript** para type safety completo
- **Tailwind CSS** con configuración avanzada y componentes personalizados
- **Contentlayer** para gestión de contenido en MDX
- **SEO optimizado** con next-seo y datos estructurados JSON-LD
- **Accesibilidad** completa (WCAG 2.1 AA)
- **Performance** optimizada con Core Web Vitals
- **Testing** con Jest y Playwright
- **CI/CD** preparado con GitHub Actions
- **Dark mode** y responsive design
- **PWA** ready con service workers

## 📁 Estructura del Proyecto

```
duartec-web/
├── app/                    # App Router (Next.js 14+)
│   ├── globals.css        # Estilos globales
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página de inicio
├── components/            # Componentes reutilizables
│   ├── header.tsx         # Header con navegación
│   └── footer.tsx         # Footer completo
├── content/               # Contenido en MDX
│   └── servicios/         # Servicios de la empresa
├── public/                # Assets estáticos
├── tests/                 # Tests unitarios y e2e
├── .husky/                # Git hooks
├── .vscode/               # Configuración VS Code
└── config files...        # Archivos de configuración
```

## 🛠️ Tecnologías

### Frontend
- **Next.js 14+** - Framework React con App Router
- **TypeScript** - Type safety y mejor DX
- **Tailwind CSS** - Framework CSS utility-first
- **Lucide React** - Iconos modernos
- **Framer Motion** - Animaciones fluidas

### Backend & CMS
- **Contentlayer** - CMS headless basado en archivos
- **MDX** - Markdown con componentes React
- **Zod** - Validación de esquemas

### Testing & Quality
- **Jest** - Testing unitario
- **Playwright** - Testing end-to-end
- **ESLint** - Linting de código
- **Prettier** - Formateo de código
- **Husky** - Git hooks
- **lint-staged** - Linting pre-commit

### Performance & SEO
- **next-seo** - Optimización SEO
- **next-sitemap** - Generación automática de sitemap
- **Core Web Vitals** - Métricas de performance
- **Structured Data** - Datos estructurados JSON-LD

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+ 
- npm, yarn o pnpm
- Git

### Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/duartec/duartec-web.git
   cd duartec-web
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   # o
   yarn install
   # o
   pnpm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env.local
   ```
   
   Editar `.env.local`:
   ```env
   NEXT_PUBLIC_SITE_URL=https://duartec.es
   OPENAI_API_KEY=tu_clave_api
   GTM_ID=tu_gtm_id
   RECAPTCHA_SITE_KEY=tu_recaptcha_key
   RECAPTCHA_SECRET_KEY=tu_recaptcha_secret
   ```

4. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   # o
   yarn dev
   # o
   pnpm dev
   ```

5. **Abrir en el navegador**
   ```
   http://localhost:3000
   ```

## 📝 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run start        # Servidor de producción

# Git Operations
npm run git:pull        # Git pull inteligente con verificaciones
npm run git:pull:dry-run # Preview de git pull sin ejecutar

# Testing
npm run test         # Tests unitarios
npm run test:e2e     # Tests end-to-end
npm run test:watch   # Tests en modo watch

# Quality
npm run lint         # Linting
npm run lint:fix     # Linting con auto-fix
npm run format       # Formateo de código
npm run type-check   # Verificación de tipos

# Análisis
npm run analyze      # Análisis de bundle
npm run sitemap      # Generar sitemap
```

## 🔄 Operaciones Git

El repositorio incluye un sistema inteligente de git pull con verificaciones de seguridad:

```bash
# Pull con verificaciones de seguridad
npm run git:pull

# Ver qué haría sin ejecutar
npm run git:pull:dry-run

# Uso directo del script
node scripts/git-pull.js --help
```

### Características del Git Pull

- ✅ Verificación de estado del repositorio
- ✅ Detección de cambios no committeados
- ✅ Identificación automática de rama
- ✅ Hooks post-pull para dependencias
- ✅ Manejo inteligente de conflictos

Para más detalles, consulta la [Guía de Git Pull](docs/GIT_PULL_GUIDE.md).

## 📄 Gestión de Contenido

### Servicios

Los servicios se gestionan en archivos MDX en `content/servicios/`:

```mdx
---
title: 'Nombre del Servicio'
description: 'Descripción del servicio'
slug: 'nombre-del-servicio'
areaServed: 'Burgos y alrededores'
hasOfferCatalog: true
faq:
  - 'Pregunta frecuente 1'
  - 'Pregunta frecuente 2'
schema:
  # Datos estructurados JSON-LD
---

# Contenido del servicio

## Secciones del servicio...
```

### Estructura de un Servicio

- **Frontmatter**: Metadatos y configuración
- **Contenido**: Markdown con componentes React
- **FAQ**: Preguntas frecuentes
- **Schema**: Datos estructurados para SEO

## 🎨 Personalización

### Colores y Temas

Los colores se configuran en `tailwind.config.js`:

```javascript
colors: {
  primary: {
    50: '#f8fafc',
    // ... más tonos
    950: '#020617',
  },
  accent: {
    50: '#eff6ff',
    // ... más tonos
    950: '#172554',
  },
}
```

### Componentes

Los componentes están en `components/` y usan:
- TypeScript para type safety

## 🧪 Probar Turbopack (experimental)

Next.js soporta Turbopack como bundler experimental en desarrollo. Hemos añadido un script para probarlo localmente:

```bash
pnpm run dev:turbo
```

Notas y consideraciones:
- Turbopack está en desarrollo y puede mostrar comportamientos distintos a Webpack.
- En Windows puede aparecer un warning de Contentlayer durante la generación de tipos; eso no siempre indica fallo.
- Si el servidor de dev no arranca o el proyecto usa features no soportadas por Turbopack, vuelve a Webpack con `pnpm dev`.

Si quieres que haga la configuración más agresiva (forzar turbopack por defecto o añadir controles de feature-detection), lo puedo añadir.
- Tailwind CSS para estilos
- Props tipadas
- Accesibilidad integrada

## 🔧 Configuración Avanzada

### SEO

El SEO se configura en:
- `app/layout.tsx` - Metadatos globales
- `next-seo` - Configuración dinámica
- `contentlayer.config.ts` - Metadatos de contenido

### Performance

Optimizaciones incluidas:
- **Image optimization** con Next.js
- **Code splitting** automático
- **Bundle analysis** con `@next/bundle-analyzer`
- **Core Web Vitals** monitoring

### Testing

```bash
# Tests unitarios
npm run test

# Tests e2e
npm run test:e2e

# Coverage
npm run test:coverage
```

## 🚀 Despliegue

### Vercel (Recomendado)

1. Conectar repositorio a Vercel
2. Configurar variables de entorno
3. Deploy automático en cada push

### Otros Proveedores

- **Netlify**: Compatible con Next.js
- **AWS Amplify**: Soporte nativo
- (Docker) configuración previa eliminada; usa Vercel, Netlify o tu proveedor preferido

### Variables de Entorno de Producción

```env
NEXT_PUBLIC_SITE_URL=https://duartec.es
NODE_ENV=production
```

## 📊 Analytics y Monitoreo

### Google Analytics

Configurar en `.env.local`:
```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Core Web Vitals

Monitoreo automático con:
- **Lighthouse CI**
- **Vercel Analytics**
- **Google PageSpeed Insights**

## 🔒 Seguridad

### Headers de Seguridad

Configurados en `next.config.mjs`:
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy
- Permissions-Policy

### Validación

- **Zod** para validación de esquemas
- **TypeScript** para type safety
- **ESLint** para detección de problemas

## 🤝 Contribución

1. Fork el proyecto
2. Crear feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

### Estándares de Código

- **TypeScript** estricto
- **ESLint** sin warnings
- **Prettier** para formateo
- **Tests** para nuevas funcionalidades

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 📞 Contacto

**Duartec Instalaciones Informáticas**
- 📧 Email: info@duartec.es
- 📱 Teléfono: 947 000 000
- 🌐 Web: https://duartec.es
- 📍 Ubicación: Burgos, España

## 🙏 Agradecimientos

- **Next.js** por el framework increíble
- **Vercel** por la plataforma de hosting
- **Tailwind CSS** por el framework de estilos
- **Contentlayer** por el CMS headless
- **Comunidad open source** por todas las herramientas

---

**Desarrollado con ❤️ para Duartec Instalaciones Informáticas**
#   D e b u g   t r i g g e r 
 
 
