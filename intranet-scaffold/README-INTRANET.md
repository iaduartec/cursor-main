# Sistema de Intranet Duartec

Sistema de administración interna para gestión de contenido de la web de Duartec.

## 🚀 Inicio Rápido

### 1. Configuración de Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con:

```bash
# Token de acceso a intranet (cámbialo por algo seguro)
INTRANET_DEBUG_TOKEN=tu_token_seguro_aqui

# URL de base de datos Neon (la misma que en el proyecto principal)
DATABASE_URL=postgresql://neondb_owner:tu_password@ep-nameless-credit-agmjdxpq-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require
```

### 2. Instalar Dependencias

```bash
pnpm install
```

### 3. Ejecutar Migraciones de Base de Datos

```bash
pnpm db:migrate
```

### 4. Iniciar Servidor de Desarrollo

```bash
pnpm dev
```

### 5. Acceder al Sistema

1. Ve a `http://localhost:3000/login`
2. Ingresa el `INTRANET_DEBUG_TOKEN` configurado
3. Serás redirigido al panel de administración

## 🔐 Sistema de Autenticación

### Autenticación por Token

- El sistema usa autenticación basada en tokens
- Los tokens se almacenan en cookies HTTP-only por seguridad
- Las sesiones duran 7 días por defecto

### Protección de Rutas

- Todas las rutas `/admin/*` están protegidas por middleware
- Los usuarios no autenticados son redirigidos automáticamente al login
- Se preserva la URL original para redirección después del login

## 📊 Funcionalidades Disponibles

### ✅ CRUD de Proyectos

- **Endpoint**: `/admin/projects`
- **API**: `/api/projects`
- Crear, leer, actualizar y eliminar proyectos
- Gestión completa desde interfaz web

### 🚧 Próximamente

- **Servicios**: CRUD de servicios
- **Blog**: Gestión de posts
- **Streams**: Administración de transmisiones en vivo

## 🛠️ Desarrollo

### Scripts Disponibles

```bash
# Desarrollo
pnpm dev                    # Inicia servidor de desarrollo
pnpm build                  # Build de producción
pnpm start                  # Inicia servidor de producción

# Base de datos
pnpm db:migrate            # Ejecutar migraciones
pnpm db:seed               # Poblar datos de ejemplo

# Testing
pnpm intranet:e2e          # Ejecutar tests E2E
pnpm intranet:e2e:ui       # Tests E2E con interfaz visual
```

### Estructura del Proyecto

```
intranet-scaffold/
├── app/
│   ├── admin/             # Panel de administración
│   ├── api/               # APIs REST
│   ├── login/             # Página de login
│   └── logout/            # Página de logout
├── lib/                   # Utilidades y configuración
├── middleware.ts          # Protección de rutas
└── db/                    # Esquemas y configuración de BD
```

## 🔌 APIs Disponibles

### Autenticación

- `POST /api/auth` - Login
- `DELETE /api/auth` - Logout

### Proyectos

- `GET /api/projects` - Listar proyectos
- `POST /api/projects` - Crear proyecto
- `PUT /api/projects/[id]` - Actualizar proyecto
- `DELETE /api/projects/[id]` - Eliminar proyecto

### Headers Requeridos para Admin APIs

```bash
x-debug-token: TU_INTRANET_DEBUG_TOKEN
```

## 🧪 Testing

### Tests E2E

```bash
# Ejecutar todos los tests
pnpm intranet:e2e

# Con interfaz visual
pnpm intranet:e2e:ui
```

### Configuración de Tests

- Los tests están configurados en `playwright.config.ts`
- Usan `INTRANET_DEBUG_TOKEN` para autenticación automática
- Incluyen tests de login, CRUD de proyectos, etc.

## 🚀 Despliegue

### Variables de Entorno Requeridas

```bash
INTRANET_DEBUG_TOKEN=tu_token_seguro
DATABASE_URL=tu_url_neon
NODE_ENV=production
```

### Build de Producción

```bash
pnpm build
pnpm start
```

## 🔒 Seguridad

- **Cookies HTTP-only**: Los tokens se almacenan de forma segura
- **Middleware de protección**: Todas las rutas admin están protegidas
- **Validación de tokens**: Verificación en cada request
- **HTTPS obligatorio**: En producción, las cookies requieren HTTPS

## 📝 Notas de Desarrollo

- La interfaz está diseñada para evitar confirmaciones bloqueantes
- Facilita la automatización y tests E2E
- El sistema está preparado para escalar con más módulos (servicios, blog, streams)

## 🆘 Solución de Problemas

### Error de conexión a BD

```bash
# Verificar variables de entorno
echo $DATABASE_URL

# Probar conexión
pnpm db:migrate
```

### Problemas de autenticación

```bash
# Verificar token
echo $INTRANET_DEBUG_TOKEN

# Limpiar cookies del navegador
# O usar incógnito para nueva sesión
```

### Tests fallan

```bash
# Asegurar que el servidor esté corriendo
pnpm dev

# Verificar configuración de Playwright
pnpm intranet:e2e:ui
```
