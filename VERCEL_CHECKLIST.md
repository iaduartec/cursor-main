# Checklist de Configuración Vercel

**Fecha**: 2025-09-25 | **Estado**: ✅ **LISTO PARA DESPLIEGUE**

## ✅ Verificaciones Técnicas Completadas

### Build y Configuración
- ✅ **Build exitoso**: `pnpm build` funciona sin errores críticos  
- ✅ **Bundle size optimizado**: ~607kB first load, 39 rutas generadas
- ✅ **Sitemap generado**: sitemap.xml y robots.txt creados automáticamente
- ✅ **Diagnóstico Vercel**: 10 configuraciones válidas, 0 issues críticos

### Configuración del Proyecto en Vercel
- ✅ **Node.js Version**: 22.x (verificado compatible)
- ✅ **Framework**: Next.js (detectado automáticamente)
- ✅ **Build Command**: `pnpm build` (configurado en vercel.json)
- ✅ **Install Command**: `pnpm install --frozen-lockfile` (configurado)
- ✅ **Root Directory**: `.` (raíz del proyecto)

### CI/CD (GitHub Actions → Vercel)
- ✅ **Workflow configurado**: `.github/workflows/deploy-workflow.yml`
- ✅ **Auto-deploy**: Push a main activa despliegue automático
- ✅ **Validación previa**: Type-check, lint, build antes de deploy
- 🔄 **Secretos GitHub**: Configurar en Settings → Secrets → Actions:
  - `VERCEL_TOKEN` (requerido)
  - `VERCEL_ORG_ID` (requerido)  
  - `VERCEL_PROJECT_ID` (requerido)

### Variables de Entorno (Configurar en Vercel Dashboard)
- 🔄 **POSTGRES_URL**: `postgresql://user:password@host/database?sslmode=require`
- 🔄 **NODE_ENV**: `production`
- 🔄 **NEXT_PUBLIC_SITE_URL**: URL de tu dominio final
- ✅ **Template disponible**: Ver `.env.vercel-import` para referencia

## � Pasos para Desplegar

### 1. Crear Proyecto en Vercel
1. Ir a [vercel.com](https://vercel.com) y hacer login
2. Clic en "Add New" → "Project"
3. Conectar repositorio: `iaduartec/cursor-main`
4. Seleccionar branch: `main`

### 2. Configuración Automática
- Framework: Next.js (detectado automáticamente)
- Build Command: `pnpm build` (desde vercel.json)
- Install Command: `pnpm install --frozen-lockfile`
- Output Directory: (dejar vacío)
- Node.js Version: 22.x (configurado en package.json)

### 3. Variables de Entorno Críticas
```bash
POSTGRES_URL=postgresql://...
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://tu-dominio.vercel.app
```

### 4. Deploy Initial
- Clic en "Deploy" para primer despliegue
- GitHub Actions manejará deploys automáticos en adelante

## ⚡ Estado Técnico Actual

**Preparación**: ✅ **100% COMPLETA**
**Build Status**: ✅ **EXITOSO** (607kB bundle, 39 rutas)
**Configuración**: ✅ **VALIDADA** (10 checks pasados)
**Deploy**: 🔄 **LISTO PARA EJECUTAR**

## 🔍 Post-Deploy Verification

Verificar después del primer deploy:
- [ ] Homepage carga: `https://tu-dominio.vercel.app/`
- [ ] API health check: `/api/health`
- [ ] Database connectivity: `/api/db-ping`
- [ ] Blog posts: `/blog`
- [ ] Sitemap: `/sitemap.xml`
- [ ] Admin panel: `/admin` (si aplicable)

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
