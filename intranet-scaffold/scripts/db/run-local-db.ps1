#!/usr/bin/env pwsh

# DESACTUALIZADO: este helper ya no inicia servicios automáticamente.
# Conservado únicamente como referencia para quien necesite establecer
# la variable DATABASE_URL manualmente en su sesión.

Write-Output "DESACTUALIZADO: este script no inicia servicios automáticamente."
Write-Output "Si necesitas una base local, arranca la instancia de Postgres manualmente"
Write-Output "y exporta DATABASE_URL en la sesión antes de ejecutar migraciones o seed."

# Ejemplo de uso manual (no inicia servicios):
# cd intranet-scaffold
# $env:DATABASE_URL = 'postgres://intranet:intranet_pass@localhost:5432/intranet_db'
# pnpm run db:migrate
# pnpm run db:seed

# Fin del helper DESACTUALIZADO
