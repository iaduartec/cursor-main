# Mitigación de Vulnerabilidades de Seguridad - Septiembre 2025

## Resumen Ejecutivo

Se han mitigado exitosamente dos vulnerabilidades de seguridad críticas encontradas en las dependencias del proyecto:

1. **esbuild Dev Server CORS Bypass** (Moderate) - CVE-2024-47068
2. **Prototype Pollution en estree-util-value-to-estree** (Moderate)

## Estado de Contentlayer

**Importante**: Contentlayer (contentlayerdev/contentlayer) ya no está mantenido activamente debido a falta de financiamiento. El proyecto oficial recomienda usar el fork mantenido: [contentlayer2](https://github.com/timlrx/contentlayer2).

Dado que Contentlayer no recibe mantenimiento activo, no se abrió un issue upstream. En su lugar, se aplicaron mitigaciones temporales efectivas usando `pnpm.overrides`.

## Mitigaciones Aplicadas

### 1. esbuild Dev Server CORS Bypass

**Problema**: El servidor de desarrollo de esbuild < 0.25.0 permitía que cualquier sitio web enviara solicitudes al servidor de desarrollo y leyera las respuestas, potencialmente exponiendo información sensible durante el desarrollo.

**Solución**: Force upgrade a esbuild@0.25.9 usando pnpm overrides:

```json
{
  "pnpm": {
    "overrides": {
      "esbuild": "0.25.9",
      "mdx-bundler>esbuild": "0.25.9",
      "@mdx-js/esbuild>esbuild": "0.25.9",
      "@esbuild-plugins/node-resolve>esbuild": "0.25.9",
      "@contentlayer/core>esbuild": "0.25.9",
      "contentlayer>esbuild": "0.25.9"
    }
  },
  "devDependencies": {
    "esbuild": "0.25.9"
  }
}
```

**Verificación**: `pnpm why esbuild` confirma que esbuild@0.25.9 se resuelve en todo el árbol de dependencias.

### 2. Prototype Pollution en estree-util-value-to-estree

**Problema**: Código malicioso podía contaminar el prototipo de Object vía el ESTree generado.

**Solución**: Force upgrade a estree-util-value-to-estree@3.4.0:

```json
{
  "pnpm": {
    "overrides": {
      "estree-util-value-to-estree": "3.4.0"
    }
  }
}
```

## Validación de Mitigaciones

- ✅ `pnpm audit --json`: 0 vulnerabilidades reportadas
- ✅ `pnpm run build`: Build exitoso sin errores
- ✅ `pnpm test`: Todos los tests pasan (11/11)
- ✅ Runtime funcional: Contentlayer/MDX pipeline funciona correctamente

## Recomendaciones Futuras

1. **Migración a Contentlayer2**: Considerar migrar al fork mantenido [contentlayer2](https://github.com/timlrx/contentlayer2) cuando sea viable.

2. **Monitoreo Continuo**: Ejecutar `pnpm audit` periódicamente para detectar nuevas vulnerabilidades.

3. **Actualización de Overrides**: Revisar y actualizar los overrides cuando se publiquen versiones oficiales parcheadas de los paquetes upstream.

## Archivos Modificados

- `SECURITY.md`: Documentación de vulnerabilidades mitigadas
- `package.json`: Aplicación de pnpm overrides y devDependency
- `pnpm-lock.yaml`: Lockfile regenerado con versiones seguras

## Fecha de Mitigación

Septiembre 2025

## Responsable

GitHub Copilot (agente de IA)
