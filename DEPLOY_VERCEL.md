Guía rápida para desplegar este proyecto en Vercel

Resumen mínimo

- Framework: Next.js
- Comando de build: npm run build
- Comando de instalación: npm ci --legacy-peer-deps
- Output: standalone (next.config.mjs)

Pasos

1) Crear cuenta en Vercel (si no la tienes).
2) Conectar el repositorio GitHub `kirivfk/cursor-main` desde el panel de Vercel.
3) En la pantalla de configuración del proyecto en Vercel, confirmar o establecer:
   - Framework Preset: Next.js
   - Build Command: npm run build
   - Install Command: npm ci --legacy-peer-deps
   - Output Directory: (dejar vacío; Next manejará la salida)

4) Variables de entorno (añadir según necesites):
   - NEXT_PUBLIC_SITE_URL = https://tu-dominio
   - NODE_ENV = production
   - (Opcional) OPENAI_API_KEY, NEXT_PUBLIC_GA_ID, GTM_ID, RECAPTCHA_* si las usas

5) Opciones recomendadas en "Advanced" (si Vercel lo permite):
   - Build cache: activar
   - Install Command: usar la misma que arriba

6) Desplegar: Vercel hará un build automático en cada push a `main`.

Checklist post-despliegue

- [ ] Revisar logs de build en Vercel para errores de TypeScript o dependencias
- [ ] Validar que la página principal carga correctamente
- [ ] Revisar `/_next/image` si usas dominios remotos: si usas imágenes externas, añade dominios permitidos en `next.config.mjs` -> images.remotePatterns

Notas técnicas

- `next.config.mjs` ya está configurado con `output: 'standalone'`, lo que genera una salida que se puede usar en contenedores.
- `vercel.json` ya incluye `buildCommand` e `installCommand` y headers de seguridad.
- Si el build falla por dependencias nativas o peer deps, prueba cambiar `Install Command` a `npm install --legacy-peer-deps` o `npm ci --legacy-peer-deps`.

Problemas comunes

- Error: "Module not found: Can't resolve 'fs'" — ocurre si se importan APIs de Node en componentes que se renderizan en cliente; asegúrate de usar dynamic imports o condicionales.
- Error de contentlayer: Si usas Contentlayer con Next, asegúrate que las dependencias de generación están presentes en `devDependencies` y que Vercel ejecuta el build correctamente.

Soporte adicional

Si quieres, puedo:
- Añadir variables recomendadas directamente en `vercel.json` (no recomendado para secrets).
- Crear un workflow de GitHub Actions que dispare despliegues o valide builds antes de push.


---
Generado automáticamente por GitHub Copilot
