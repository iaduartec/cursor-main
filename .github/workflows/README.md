Configuración de Deployment Automático
===========================================

Este repositorio está configurado para desplegar automáticamente a Vercel cada vez que se hace push a la rama `main`.

Configuración Requerida
------------------------

Para que el workflow funcione, necesitas configurar las siguientes secrets en GitHub:

### VERCEL_TOKEN

- Ve a [Vercel Dashboard](https://vercel.com/dashboard)
- Settings > Tokens
- Crea un nuevo token con permisos de deployment
- Copia el token

### VERCEL_PROJECT_ID

- En Vercel Dashboard, ve a tu proyecto
- Settings > General
- Copia el Project ID

### VERCEL_ORG_ID (opcional)

- Copia el Team ID

Configurar Secrets en GitHub
-----------------------------

1. Ve al repositorio en GitHub
2. Settings > Secrets and variables > Actions
3. Agrega las siguientes secrets:
   - `VERCEL_TOKEN`: Tu token de Vercel
   - `VERCEL_PROJECT_ID`: ID del proyecto
   - `VERCEL_ORG_ID`: ID de la organización (si aplica)

Cómo Funciona
-------------

- Cada push a `main` activará el workflow
- Se instala Node.js 22 y pnpm
- Se ejecuta `pnpm build` (que incluye migraciones de DB)
- Se despliega automáticamente a Vercel

Triggers
--------

- Push a `main`
- Manual (workflow_dispatch) para pruebas

Solución de Problemas
---------------------

1. Revisa los logs del workflow en GitHub Actions
2. Verifica que las secrets estén configuradas correctamente
3. Asegúrate de que el proyecto esté conectado a Vercel
