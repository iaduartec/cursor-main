param()

# Lightweight wrapper that sets env vars for PowerShell and runs the root intranet:e2e script
$env:USE_IN_MEMORY_DB = '1'
$env:SKIP_CONTENTLAYER = '1'
Write-Host "Starting intranet E2E with USE_IN_MEMORY_DB=$($env:USE_IN_MEMORY_DB) SKIP_CONTENTLAYER=$($env:SKIP_CONTENTLAYER)"
pnpm intranet:e2e
