# CONFIGURAR OPENAI_API_KEY EN VERCEL

## Pasos para producción:

1. **Ve a Vercel Dashboard**: https://vercel.com/dashboard
2. **Selecciona tu proyecto**: cursor-main
3. **Settings → Environment Variables**
4. **Add Variable**:
   - **Name**: `OPENAI_API_KEY`
   - **Value**: `[YOUR_ACTUAL_OPENAI_API_KEY]`
   - **Environments**: ✓ Production ✓ Preview ✓ Development

5. **Deploy**: `vercel --prod`

## También configura:
- **ADMIN_PASSWORD**: `admin2024secure` (o tu password preferido)

## ✅ Estado actual:
- ✅ API key en .env.local (desarrollo)
- ✅ Servidor corriendo en http://localhost:3000
- ✅ Admin accesible
- ⏳ Falta configurar en Vercel para producción

## 🧪 Prueba ahora:
1. http://localhost:3000/admin (login)
2. /admin/posts/new (crear post)  
3. "Optimizar con AI" (probar asistente SEO)