# Configuración de Neon RLS con Clerk

Esta guía explica cómo completar la configuración de Neon RLS (Row-Level Security) con Clerk para autenticación segura en tu aplicación.

## ✅ Lo que ya está implementado

1. **Clerk instalado y configurado** - Middleware, providers y páginas de auth
2. **Esquema de BD actualizado** - Campos `userId` agregados a todas las tablas
3. **RLS Policies definidas** - Políticas de seguridad en el esquema
4. **Cliente autenticado** - Función `createAuthenticatedClient` para conexiones con JWT
5. **Páginas de login/signup** - Interfaz de usuario para autenticación

## 🔧 Pasos para completar la configuración

### 1. Configurar Clerk

1. Ve a [Clerk Dashboard](https://dashboard.clerk.com/)
2. Crea una nueva aplicación
3. Copia las claves API:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
4. Actualiza `.env.local` con tus claves reales

### 2. Configurar Neon RLS

1. Ve a tu [Neon Dashboard](https://console.neon.tech/)
2. Selecciona tu proyecto
3. Ve a la pestaña "Authentication"
4. Configura Clerk como provider:
   - **Provider**: Clerk
   - **JWKS URL**: `https://[your-clerk-domain].clerk.accounts.dev/.well-known/jwks.json`
   - **Audience**: Tu Clerk Application ID (opcional)

### 3. Aplicar RLS Policies

Ejecuta el script para aplicar las políticas RLS:

```bash
node scripts/apply-rls-policies.mjs
```

### 4. Actualizar datos existentes (opcional)

Si tienes datos existentes, puedes actualizarlos para asignar un userId:

```sql
-- Asignar posts a un usuario específico
UPDATE posts SET user_id = 'user_123' WHERE user_id IS NULL;

-- Asignar proyectos, servicios y streams de la misma manera
UPDATE projects SET user_id = 'user_123' WHERE user_id IS NULL;
UPDATE services SET user_id = 'user_123' WHERE user_id IS NULL;
UPDATE streams SET user_id = 'user_123' WHERE user_id IS NULL;
```

### 5. Probar la autenticación

1. Ve a `/admin/login` para iniciar sesión
2. Después de autenticarte, podrás acceder a `/admin`
3. Las operaciones de BD ahora usarán RLS automáticamente

## 📝 Uso en código

### Crear contenido autenticado

```typescript
import { createPost } from '@/lib/auth-db-posts';

// Esto automáticamente:
// 1. Obtiene el userId del JWT
// 2. Crea una conexión autenticada
// 3. Aplica RLS policies
await createPost({
  title: 'Mi post',
  content: 'Contenido...',
  slug: 'mi-post'
});
```

### Conexión directa a BD

```typescript
import { createAuthenticatedClient } from '@/db/client';
import { auth } from '@clerk/nextjs/server';

const { getToken } = await auth();
const token = await getToken();
const db = createAuthenticatedClient(token);

// Ahora todas las consultas respetan RLS
const posts = await db.select().from(postsTable);
```

## 🔒 Seguridad

- **RLS activado**: Solo los usuarios pueden acceder a sus propios datos
- **JWT validado**: Neon valida automáticamente los tokens
- **Conexión segura**: Usa HTTPS y autenticación basada en JWT
- **Fallback de seguridad**: RLS protege incluso si otras capas fallan

## 🐛 Solución de problemas

### Error de conexión
- Verifica que `DATABASE_AUTHENTICATED_URL` esté configurado
- Asegúrate de que el JWKS URL de Clerk sea correcto

### Políticas RLS no funcionan
- Ejecuta `node scripts/apply-rls-policies.mjs`
- Verifica que RLS esté habilitado: `ALTER TABLE tabla ENABLE ROW LEVEL SECURITY;`

### Problemas de autenticación
- Verifica las claves de Clerk en `.env.local`
- Asegúrate de que el middleware esté configurado correctamente

## 📚 Recursos adicionales

- [Documentación de Neon RLS](https://neon.tech/docs/guides/neon-rls)
- [Documentación de Clerk](https://clerk.com/docs)
- [Guía de Drizzle RLS](https://orm.drizzle.team/docs/rls)