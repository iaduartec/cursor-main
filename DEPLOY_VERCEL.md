<!--
Resumen generado automáticam4) Variables de entorno (añadir según necesites):
   - NEXT_PUBLIC_SITE_URL = `https://tu-dominio`
   - NODE_ENV = production
   - (Opcional) OPENAI_API_KEY, NEXT_PUBLIC_GA_ID, GTM_ID, RECAPTCHA_* si
     las usas.

DEPLOY_VERCEL.md

2025-09-13T06:20:07.355Z

——————————————————————————————
Archivo .md: DEPLOY_VERCEL.md
Tamaño: 2388 caracteres, 57 líneas
Resumen básico generado automáticamente sin análisis de IA.
Contenido detectado basado en extensión y estructura básica.
-->
# Guía rápida para desplegar este proyecto en Vercel

Resumen mínimo

- Framework: Next.js
- Comando de build: pnpm build
- Comando de instalación: pnpm install --frozen-lockfile
- Output: default Next.js (optimizado para Vercel)

Pasos

1) Crear cuenta en Vercel (si no la tienes).
2) Conectar el repositorio GitHub `iaduartec/cursor-main` desde el panel de
   Vercel.
3) En la pantalla de configuración del proyecto en Vercel, confirmar o
   establecer:
   - Framework Preset: Next.js
   - Build Command: pnpm build
   - Install Command: pnpm install --frozen-lockfile
   - Output Directory: (dejar vacío; Next manejará la salida)
   - Node.js Version: 22.x

## Standalone y postbuild

- En Vercel (Linux) el build activa automáticamente `output: 'standalone'` para optimizar el runtime.
- En Windows local se desactiva para evitar errores de symlink (EPERM) durante el build.
- Tras el build, el script `postbuild` ejecuta `next-sitemap` (según `next-sitemap.config.js` en la raíz) y genera `sitemap.xml` y `robots.txt`.

## Despliegue automático (GitHub Actions)

Este repositorio despliega a producción automáticamente en Vercel cuando haces push a `main`.

Requisitos (configurar en GitHub > Settings > Secrets and variables > Actions):

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

Flujo:

```mermaid
flowchart LR
  A[git push main] --> B[GitHub Actions: validate]
  B --> C[Deploy to Vercel --prod]
  C --> D[Vercel build]
  D --> E[postbuild next-sitemap]
  E --> F[Producción activa]
```

Archivo del workflow: `.github/workflows/deploy-workflow.yml`.

1) Variables de entorno requeridas:
   - POSTGRES_URL = `postgresql://user:password@host/database?sslmode=require`
   - NODE_ENV = production
   - NEXT_PUBLIC_SITE_URL = `https://tu-dominio.vercel.app`
   - (Opcional) OPENAI_API_KEY, NEXT_PUBLIC_GA_ID, GTM_ID, RECAPTCHA_* si
     las usas

2) Opciones recomendadas en "Advanced" (si Vercel lo permite):
   - Build cache: activar
   - Install Command: usar la misma que arriba

3) Desplegar: Vercel hará un build automático en cada push a `main`.

Checklist post-despliegue

- [ ] Revisar logs de build en Vercel para errores de TypeScript o dependencias
- [ ] Validar que la página principal carga correctamente
- [ ] Revisar `/_next/image` si usas dominios remotos: si usas imágenes
  externas, añade dominios permitidos en `next.config.mjs` -> images.remotePatterns

Notas técnicas

- `vercel.json` está configurado con comandos optimizados para pnpm y Node.js 22.x.
- Headers de seguridad incluidos en la configuración.
- Si el build falla por dependencias, asegúrate de usar Node.js 22.x o superior.
- El proyecto requiere `pnpm install --frozen-lockfile` para garantizar
  reproducibilidad en el despliegue.

Problemas comunes y soluciones

- **Error: "Module not found: Can't resolve 'fs'"** — ocurre si se importan
  APIs de Node en componentes que se renderizan en cliente; asegúrate de
  usar dynamic imports o condicionales.
- **Error de contentlayer** — Si usas Contentlayer con Next, asegúrate que las
  dependencias de generación están presentes en `devDependencies` y que
  Vercel ejecuta el build correctamente.
- **Error: "No such file or directory, scandir '/var/task/.next/standalone'"** —
  Verifica que la configuración del repo está aplicada: en Vercel (Linux) se activa `output: 'standalone'` y en Windows local se desactiva para evitar EPERM. No fuerces standalone en entornos no compatibles; si necesitas forzarlo en CI, usa `ENABLE_STANDALONE=1`.
- **Error de peer dependencies** — Vercel detectará automáticamente las
  dependencias faltantes. Revisa que todas las dependencias estén en
  package.json.
- **Error de Node.js version** — Configura Node.js 22.x en la configuración
  del proyecto en Vercel Dashboard.
- **Build timeout** — Aumenta el tiempo límite en Settings > Functions o
  optimiza el proceso de build.

Soporte adicional

Si quieres, puedo:

- Añadir variables recomendadas directamente en `vercel.json` (no recomendado
  para secrets).
- Crear un workflow de GitHub Actions que dispare despliegues o valide builds
  antes de push.

---
Generado automáticamente por GitHub Copilot
