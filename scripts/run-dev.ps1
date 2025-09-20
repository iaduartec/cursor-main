param()

# Helper to start dev server with in-memory DB and skip Contentlayer
$env:USE_IN_MEMORY_DB = '1'
$env:SKIP_CONTENTLAYER = '1'

Write-Host "Starting dev server with USE_IN_MEMORY_DB=$($env:USE_IN_MEMORY_DB) SKIP_CONTENTLAYER=$($env:SKIP_CONTENTLAYER)"
pnpm dev
