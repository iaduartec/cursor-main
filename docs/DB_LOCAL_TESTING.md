# Probar la base de datos en desarrollo

Este documento explica cómo probar la conexión a la base de datos en desarrollo
y cómo ejecutar los diagnósticos incluidos en el repositorio.

1. Copia el archivo de ejemplo `.env.example.db` a `.env.local` y rellena las
   credenciales reales (no comites este archivo).

1. Para forzar la conexión en desarrollo y ver errores detallados, exporta las
   variables en PowerShell y ejecuta el script de diagnóstico:

```powershell
$env:POSTGRES_URL='postgres://USER:PASS@HOST:5432/DB'
$env:ENABLE_DB_IN_DEV='1'
$env:DB_VERBOSE_LOG='1'
pnpm exec tsx scripts/db/check-select.ts
```

1. Resultado esperado:

- Si la conexión falla por red/credenciales verás `ECONNREFUSED` o errores de
  autenticación.
- Si la conexión existe pero las tablas/columnas faltan verás un
  `DrizzleQueryError` con el `query` y `params` incluidos.

1. Pasos de corrección comunes:

- Si no hay conexión: revisa host/puerto/firewall y credenciales.
- Si faltan tablas/columnas: aplica migraciones `pnpm run db:migrate` y carga
  seeds `pnpm run db:seed` si procede.

1. Seguridad:

- Nunca comites credenciales. Usa `.env.local` para pruebas locales.
