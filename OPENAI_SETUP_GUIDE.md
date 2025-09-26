# CONFIGURACIÓN OPENAI API KEY

## 🚀 Para Desarrollo Local

1. **Obtén tu API Key de OpenAI**:
   - Ve a: https://platform.openai.com/api-keys
   - Crea una nueva API key
   - Cópiala (empieza con `sk-...`)

2. **Edita `.env.local`**:
   ```bash
   # Reemplaza esta línea:
   OPENAI_API_KEY=sk-your-openai-api-key-here
   
   # Por tu API key real:
   OPENAI_API_KEY=sk-proj-tu-api-key-aqui
   ```

3. **Reinicia el servidor**:
   ```bash
   pnpm dev
   ```

## 🌐 Para Producción (Vercel)

### Opción 1: Vercel Dashboard
1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Agrega:
   - **Name**: `OPENAI_API_KEY`
   - **Value**: `sk-proj-tu-api-key-aqui`
   - **Environment**: Production, Preview, Development

### Opción 2: Vercel CLI
```bash
vercel env add OPENAI_API_KEY
# Pega tu API key cuando te lo pida
# Selecciona: Production, Preview, Development
```

### Opción 3: Archivo .env.production (NO recomendado)
```bash
# NO hagas esto - las API keys no deben estar en el código
OPENAI_API_KEY=sk-proj-...  # ❌ INSEGURO
```

## 🧪 Probar la Integración

### Local:
```bash
# 1. Asegúrate que .env.local tenga la API key
# 2. Inicia el servidor
pnpm dev

# 3. Ve a http://localhost:3000/admin
# 4. Login con password: admin2024secure
# 5. Crea un nuevo post
# 6. Usa el botón "Optimizar con AI"
```

### Producción:
```bash
# Después de configurar en Vercel
vercel --prod

# Ve a tu dominio/admin y prueba
```

## 🔍 Troubleshooting

### Error: "OpenAI API key not configured"
- Verifica que la variable esté configurada
- Reinicia el servidor local / redeploy en Vercel
- Verifica que no hay espacios extra en la API key

### Error: "Invalid API Key"
- Verifica que la API key sea correcta
- Asegúrate que empiece con `sk-`
- Verifica que tu cuenta OpenAI tenga créditos

### Error: "Rate Limit"
- Tu API key ha excedido el límite
- Espera unos minutos o upgrade tu plan OpenAI

## 📁 Estructura de Variables

```bash
# Desarrollo (.env.local)
OPENAI_API_KEY=sk-proj-dev-key...
ADMIN_PASSWORD=admin2024secure

# Producción (Vercel Dashboard)
OPENAI_API_KEY=sk-proj-prod-key...  
ADMIN_PASSWORD=tu-password-seguro-produccion
```

**✅ Una vez configurado, el sistema de optimización AI estará completamente funcional.**