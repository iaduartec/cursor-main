# CONFIGURACIÓN VARIABLES ENTORNO VERCEL

## Variables Requeridas para Producción

### 1. ADMIN_PASSWORD
```bash
# Password para admin login
# Configura en Vercel Dashboard: Project Settings > Environment Variables
ADMIN_PASSWORD=tu_password_seguro_aqui
```

### 2. OPENAI_API_KEY  
```bash
# API Key de OpenAI para optimización SEO
# Obtén tu key desde: https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-your-openai-api-key-here
```

### 3. NEON DATABASE (Ya configurada)
```bash
# Variables de Neon ya están configuradas
DATABASE_URL=postgresql://...
POSTGRES_URL=postgresql://...
POSTGRES_PRISMA_URL=postgresql://...
# etc.
```

## Configuración en Vercel

1. Ve a tu proyecto en Vercel Dashboard
2. Settings > Environment Variables  
3. Agrega las variables:
   - `ADMIN_PASSWORD`: password seguro para admin
   - `OPENAI_API_KEY`: tu API key de OpenAI
4. Deploy para que tomen efecto

## Verificación Post-Deploy

```bash
# Test login admin
curl -X POST https://tu-dominio.vercel.app/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"password": "tu_password"}'

# Test OpenAI optimization (necesita estar logeado)
curl -X POST https://tu-dominio.vercel.app/api/admin/openai/optimize-seo \
  -H "Content-Type: application/json" \
  -H "Cookie: admin-token=..." \
  -d '{"title": "Test", "content": "Test content", "type": "blog"}'
```

## Estado Actual

✅ **OpenAI SDK**: Instalado y funcional  
✅ **Admin System**: Completamente seguro  
✅ **Build**: Exitoso con lazy loading  
⏳ **Variables ENV**: Necesitan configurarse en Vercel  
⏳ **Deploy**: Listo para producción  

## Próximos Pasos

1. Configurar `ADMIN_PASSWORD` en Vercel
2. Configurar `OPENAI_API_KEY` en Vercel  
3. Deploy a producción
4. Probar login y optimización AI