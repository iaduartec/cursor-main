# Workflow de Generación de Artículos

Este workflow automatiza la generación de artículos para el blog usando IA (OpenAI y Gemini).

## 🚀 Cómo usar

### Opción 1: Crear un Issue con título específico

Crea un issue con uno de estos formatos de título:

```
Artículo: Título del artículo
Artículo: Cómo implementar sistemas de videovigilancia
Nuevo artículo: Gestión eficiente de residuos urbanos
Generar artículo: Optimización energética en edificios públicos
```

### Opción 2: Usar la etiqueta "generate-article"

1. Crea un issue con el tema en la primera línea del cuerpo
2. Añade la etiqueta `generate-article`
3. Opcionalmente, especifica parámetros en el cuerpo:

```
Tema del artículo aquí

Estilo: fotográfico
Color: azul
Detalles: plano general del pueblo, entorno montañoso
Categoria: Tecnología
```

## 📋 Parámetros opcionales

En el cuerpo del issue puedes especificar:

- **Estilo**: `fotográfico`, `minimalista`, `artístico`, etc. (por defecto: fotográfico)
- **Color**: Color de acento para las imágenes (por defecto: azul)
- **Detalles**: Descripción específica para las imágenes
- **Categoria**: Categoría del artículo

## 🔧 Configuración necesaria

### Secrets de GitHub

Configura estos secrets en tu repositorio:

1. `OPENAI_API_KEY`: Tu clave de API de OpenAI
2. `GEMINI_API_KEY`: Tu clave de API de Google Gemini

### Permisos

El workflow necesita estos permisos:
- `contents: write` - Para crear archivos
- `issues: write` - Para comentar y cerrar issues

## 📁 Archivos generados

El workflow crea:

- **Artículo**: `content/blog/{slug}.mdx`
- **Imágenes**: `public/images/blog/{slug}/`

## 🛠️ Solución de problemas

### Error: "Missing API key"

Verifica que los secrets estén configurados correctamente en Settings > Secrets and variables > Actions.

### Error: "No se generó el archivo del artículo"

1. Verifica que el título del issue tenga el formato correcto
2. Revisa los logs del workflow para ver errores específicos
3. Asegúrate de que las APIs de IA estén funcionando

### Error: "Permission denied" en Git

El workflow usa `GITHUB_TOKEN` automáticamente. Si hay problemas, verifica que el repositorio tenga permisos de escritura para Actions.

## 🧪 Pruebas locales

Ejecuta el script de prueba para verificar la configuración:

```bash
python test_workflow.py
```

## 📝 Ejemplos de uso

### Ejemplo 1: Artículo simple
```
Título: Artículo: Sistemas de videovigilancia inteligente
Cuerpo: (vacío)
```

### Ejemplo 2: Artículo con parámetros
```
Título: Nuevo artículo: Gestión de residuos urbanos
Cuerpo: 
Estilo: minimalista
Color: verde
Detalles: contenedores inteligentes, ciudad moderna
Categoria: Sostenibilidad
```

### Ejemplo 3: Con etiqueta
```
Título: Solicitud de artículo
Cuerpo: Implementación de energías renovables en edificios públicos
Etiquetas: generate-article
```

## 🔄 Flujo del workflow

1. **Trigger**: Issue creado/editado/etiquetado
2. **Parse**: Extrae tema y parámetros del issue
3. **Setup**: Instala dependencias de Python
4. **Generate**: Crea artículo e imágenes con IA
5. **Commit**: Guarda cambios en el repositorio
6. **Comment**: Notifica resultado en el issue
7. **Close**: Cierra el issue automáticamente

## 📊 Fallbacks

El sistema tiene múltiples fallbacks:

- **Texto**: OpenAI → Gemini → Plantilla local
- **Imágenes**: Gemini → OpenAI
- **Formato**: Conversión automática a WEBP para optimización

## 🎯 Consejos

1. **Títulos claros**: Usa títulos descriptivos y específicos
2. **Parámetros opcionales**: Solo especifica los que necesites
3. **Revisión**: Siempre revisa el contenido generado antes de publicar
4. **Backup**: El workflow hace commit directo, considera hacer backup antes

## 🆘 Soporte

Si tienes problemas:

1. Revisa los logs del workflow en Actions
2. Ejecuta `python test_workflow.py` localmente
3. Verifica la configuración de secrets
4. Comprueba que las APIs de IA estén activas
