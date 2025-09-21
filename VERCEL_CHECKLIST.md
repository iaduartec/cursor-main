# Checklist Pre-Despliegue en Vercel

Este checklist te ayudará a evitar errores comunes durante el despliegue en Vercel.

## ✅ Antes del Despliegue

### Configuración del Proyecto

- [ ] **Node.js Version**: Configurado como 22.x en Vercel Dashboard
- [ ] **Framework**: Detectado automáticamente como Next.js
- [ ] **Build Command**: `pnpm build`
- [ ] **Install Command**: `pnpm install --frozen-lockfile`
- [ ] **Root Directory**: `.` (raíz del proyecto)

### CI/CD (GitHub Actions → Vercel)

- [ ] Workflow de deploy activado: `.github/workflows/deploy-workflow.yml`
- [ ] Secretos configurados en GitHub → Settings → Secrets and variables → Actions:
  - `VERCEL_TOKEN`
  - `VERCEL_ORG_ID`
  - `VERCEL_PROJECT_ID`
  

### Variables de Entorno Requeridas

- [ ] **POSTGRES_URL**: URL de conexión a PostgreSQL/Neon
- [ ] **NODE_ENV**: `production`
- [ ] **NEXT_PUBLIC_SITE_URL**: URL de tu sitio (ej: `https://midominio.vercel.app`)

### Variables de Entorno Opcionales

- [ ] **OPENAI_API_KEY**: Si usas funcionalidades de IA
- [ ] **NEXT_PUBLIC_GA_ID**: Para Google Analytics
- [ ] **GTM_ID**: Para Google Tag Manager
- [ ] **RECAPTCHA_SITE_KEY** y **RECAPTCHA_SECRET_KEY**: Si usas reCAPTCHA

### Verificación Local

- [ ] **Build local exitoso**: Ejecutar `pnpm build` sin errores
- [ ] **Diagnóstico Vercel**: Ejecutar `pnpm vercel:diagnose`
- [ ] **Dependencias actualizadas**: `pnpm-lock.yaml` sincronizado
- [ ] **Variables de entorno locales**: Archivos `.env*` no committeados

## 🔍 Diagnóstico Automático

Ejecuta el diagnóstico automático antes del despliegue:

```bash
# Diagnóstico completo (incluye test de build)
pnpm vercel:diagnose

# Diagnóstico rápido (sin test de build)
pnpm vercel:diagnose:quick
```

## 🚨 Errores Comunes y Soluciones

### Error: "No serverless pages were built"

- **Causa**: Incompatibilidad de configuración de salida o entorno
- **Solución**: En este proyecto `output: 'standalone'` se activa en Vercel (Linux) y se desactiva en Windows local. Verifica que no estés forzando standalone en entornos no compatibles.

### Error: "Module not found: Can't resolve 'fs'"

- **Causa**: Uso de APIs de Node.js en componentes cliente
- **Solución**: Usar dynamic imports o condicionales

### Error: Build timeout

- **Causa**: Build muy lento o proceso colgado
- **Soluciones**:
  - Aumentar timeout en Vercel Settings > Functions
  - Optimizar imports y dependencias
  - Usar `SKIP_CONTENTLAYER=1` si es necesario

### Error: "getaddrinfo ENOTFOUND host"

- **Causa**: Error de conexión a base de datos durante build
- **Solución**: El proyecto detecta esto automáticamente y usa modo offline

### Error de peer dependencies

- **Causa**: Dependencias incompatibles o faltantes
- **Solución**: Revisar warnings de instalación y actualizar dependencies

## 📝 Post-Despliegue

### Verificación Inmediata

- [ ] **Página principal**: Carga correctamente
- [ ] **Enlaces internos**: Funcionan correctamente
- [ ] **Imágenes**: Se muestran sin errores
- [ ] **APIs**: Responden correctamente

### Verificación de Performance

- [ ] **Tiempo de carga**: < 3 segundos en la página principal
- [ ] **Core Web Vitals**: Revisar en Vercel Analytics
- [ ] **SEO**: Verificar meta tags y sitemap.xml
  - Nota: El sitemap se genera en `postbuild` con `next-sitemap` según `next-sitemap.config.js` (raíz)

### Monitoreo

- [ ] **Logs de función**: Revisar en Vercel Dashboard
- [ ] **Analytics**: Configurar seguimiento si es necesario
- [ ] **Alertas**: Configurar notificaciones de errores

## 🛠️ Comandos Útiles

```bash
# Limpia cache local y reconstruye
rm -rf .next node_modules/.cache
pnpm install
pnpm build

# Valida frontmatter MDX
pnpm validate:mdx

# Genera imágenes faltantes
pnpm images:generate

# Lint y format
pnpm lint:fix
pnpm format
```

## 📞 Soporte

Si encuentras errores no cubiertos en este checklist:

1. Revisa los logs detallados en Vercel Dashboard
2. Ejecuta `pnpm vercel:diagnose` para identificar problemas
3. Consulta la [documentación de Vercel](https://vercel.com/docs)
4. Revisa `DEPLOY_VERCEL.md` para configuración específica

---

## Checklist actualizado para proyecto Duartec Web
