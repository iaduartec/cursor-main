param(
  [string]$DbUrl
)

# Helper to apply migrations and seeds to a real Postgres/Supabase DB
# Usage:
#   .\apply-to-db.ps1 -DbUrl "postgres://..."
# Or set env var SUPABASE_DB_URL or POSTGRES_URL

if (-not $DbUrl) {
  $DbUrl = $env:SUPABASE_DB_URL; if (-not $DbUrl) { $DbUrl = $env:POSTGRES_URL }
}

if (-not $DbUrl) {
  Write-Error "No DB URL provided. Set -DbUrl or SUPABASE_DB_URL/POSTGRES_URL environment variable."
  exit 2
}

Write-Output "Applying migrations and seeds to DB: $($DbUrl -replace '(:\\/\\/).*@','://[REDACTED]@')"

# Export env var for node scripts
$env:POSTGRES_URL = $DbUrl
$env:DATABASE_URL = $DbUrl
$env:SUPABASE_DB_URL = $DbUrl

# Run migration script
Write-Output "Running migration script..."
pnpm -s run db:migrate:apply
if ($LASTEXITCODE -ne 0) { Write-Error "Migration failed with exit code $LASTEXITCODE"; exit $LASTEXITCODE }

# Run seed script for comments
Write-Output "Running seed-comments script..."
pnpm -s run db:seed:comments:apply
if ($LASTEXITCODE -ne 0) { Write-Error "Seed failed with exit code $LASTEXITCODE"; exit $LASTEXITCODE }

Write-Output "Migrations and seeds applied successfully."
