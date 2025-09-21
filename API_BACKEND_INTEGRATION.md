# APIs de Administración - Backend Integration

Este documento describe las APIs REST disponibles para gestionar el contenido de la web desde un backend externo mediante SQL.

## 🔐 Autenticación

Todas las operaciones de escritura requieren autenticación mediante header `Authorization`:

```http
Authorization: Bearer YOUR_ADMIN_TOKEN
```

El token se configura en la variable de entorno `ADMIN_TOKEN`.

## 📝 API de Posts

### GET /api/admin/posts

Obtiene todos los posts.

**Respuesta:**

```json
{
  "posts": [
    {
      "id": 1,
      "slug": "mi-primer-post",
      "title": "Mi Primer Post",
      "description": "Descripción del post",
      "content": "Contenido completo en Markdown",
      "category": "seguridad",
      "image": "/images/posts/post1.jpg",
      "date": "2024-01-15T10:00:00.000Z",
      "published": true,
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T10:00:00.000Z"
    }
  ]
}
```

### POST /api/admin/posts

Crea un nuevo post.

**Campos requeridos:** `slug`, `title`, `content`

**Ejemplo:**

```bash
curl -X POST http://localhost:3000/api/admin/posts \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "nuevo-post",
    "title": "Título del Nuevo Post",
    "description": "Descripción opcional",
    "content": "# Contenido en Markdown\n\nTexto del post...",
    "category": "seguridad",
    "image": "/images/posts/nuevo.jpg",
    "published": true
  }'
```

### PUT /api/admin/posts

Actualiza un post existente.

**Identificadores:** `id` o `slug`

**Ejemplo:**

```bash
curl -X PUT http://localhost:3000/api/admin/posts \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "nuevo-post",
    "title": "Título Actualizado"
  }'
```

### DELETE /api/admin/posts?id=1

Elimina un post.

**Parámetros:** `id` o `slug`

**Ejemplo:**

```bash
curl -X DELETE "http://localhost:3000/api/admin/posts?id=1" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

## 🔧 API de Servicios

### GET /api/admin/services

Obtiene todos los servicios.

### POST /api/admin/services

Crea un nuevo servicio.

**Campos requeridos:** `slug`, `title`

**Ejemplo:**

```bash
curl -X POST http://localhost:3000/api/admin/services \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "nuevo-servicio",
    "title": "Servicio de Videovigilancia",
    "description": "Descripción del servicio",
    "areaServed": "Burgos y alrededores",
    "hasOfferCatalog": true
  }'
```

### PUT /api/admin/services

Actualiza un servicio.

### DELETE /api/admin/services?id=1

Elimina un servicio.

## 🏗️ API de Proyectos

### GET /api/admin/projects

Obtiene todos los proyectos.

### POST /api/admin/projects

Crea un nuevo proyecto.

**Campos requeridos:** `slug`, `title`

**Ejemplo:**

```bash
curl -X POST http://localhost:3000/api/admin/projects \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "proyecto-ejemplo",
    "title": "Proyecto de Instalación CCTV",
    "description": "Descripción del proyecto",
    "content": "Detalles completos del proyecto...",
    "category": "videovigilancia",
    "image": "/images/proyectos/proyecto1.jpg"
  }'
```

### PUT /api/admin/projects

Actualiza un proyecto.

### DELETE /api/admin/projects?id=1

Elimina un proyecto.

## 🎥 API de Streams (Ya existente)

### GET /api/streams

Obtiene todos los streams.

### POST /api/streams

Crea un nuevo stream.

## 🔄 Revalidación Automática

Cuando se modifican datos mediante estas APIs, los caches de Next.js se revalidan automáticamente:

- Posts: Tag `blogs` y `posts`
- Servicios: Tag `services`
- Proyectos: Tag `projects`

Esto asegura que los cambios sean visibles inmediatamente en la web.

## 📊 Migración de Contenido Existente

Para migrar contenido MDX existente a la base de datos:

```bash
# Simulación (ver qué se migraría)
pnpm db:migrate:mdx --dry-run

# Migrar todo
pnpm db:migrate:mdx

# Migrar solo posts
pnpm db:migrate:mdx --type=posts

# Migrar solo servicios
pnpm db:migrate:mdx --type=services
```

## 🗄️ Esquema de Base de Datos

### Tabla `posts`

- `id`: Serial (PK)
- `slug`: Varchar(255) UNIQUE
- `title`: Varchar(255)
- `description`: Text
- `content`: Text
- `category`: Varchar(100)
- `image`: Varchar(1024)
- `date`: Timestamp
- `published`: Boolean (default: true)
- `createdAt`, `updatedAt`: Timestamps

### Tabla `services`

- `id`: Serial (PK)
- `slug`: Varchar(255) UNIQUE
- `title`: Varchar(255)
- `description`: Text
- `image`: Varchar(1024)
- `areaServed`: Varchar(255)
- `hasOfferCatalog`: Boolean (default: false)
- `createdAt`, `updatedAt`: Timestamps

### Tabla `projects`

- `id`: Serial (PK)
- `slug`: Varchar(255) UNIQUE
- `title`: Varchar(255)
- `description`: Text
- `content`: Text
- `image`: Varchar(1024)
- `category`: Varchar(100)
- `date`: Timestamp
- `createdAt`, `updatedAt`: Timestamps

## 🔧 Configuración del Backend

Para integrar desde tu backend:

1. **Configurar conexión a Neon**: Usar las mismas variables de entorno `POSTGRES_URL`
2. **Autenticación**: Incluir `ADMIN_TOKEN` en requests
3. **Manejo de errores**: Verificar códigos de estado HTTP
4. **Reintentos**: Implementar reintentos para operaciones fallidas

## 📝 Ejemplo de Integración en Python

```python
import requests

BASE_URL = "https://tu-dominio.com"
ADMIN_TOKEN = "tu-admin-token"

headers = {
    "Authorization": f"Bearer {ADMIN_TOKEN}",
    "Content-Type": "application/json"
}

# Crear un post
post_data = {
    "slug": "nuevo-post-desde-backend",
    "title": "Post creado desde el backend",
    "content": "# Contenido\n\nEste post fue creado mediante API.",
    "category": "tecnologia",
    "published": True
}

response = requests.post(f"{BASE_URL}/api/admin/posts", json=post_data, headers=headers)
print(response.json())
```
