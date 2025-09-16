param(
  [string]$DbUrl,
  [switch]$Backup,
  [string]$BackupPath
)

# Helper to apply migrations and seeds to a real Postgres DB
# Usage:
#   .\apply-to-db.ps1 -DbUrl "postgres://..."
# Or set env var POSTGRES_URL

if (-not $DbUrl) {
  $DbUrl = $env:POSTGRES_URL
}

if (-not $DbUrl) {
  Write-Error "No DB URL provided. Set -DbUrl or POSTGRES_URL environment variable."
  exit 2
}

Write-Output "Applying migrations and seeds to DB: $($DbUrl -replace '(:\\/\\/).*@','://[REDACTED]@')"

# Export env var for node scripts
$env:POSTGRES_URL = $DbUrl
$env:DATABASE_URL = $DbUrl

# If backup requested, try to run pg_dump
if ($Backup) {
  Write-Output "Backup requested — checking for pg_dump in PATH..."
  $pgDump = Get-Command pg_dump -ErrorAction SilentlyContinue
  if (-not $pgDump) {
    Write-Error "pg_dump not found in PATH. Install PostgreSQL client tools or run a manual backup. Aborting."
    exit 3
  }

  if (-not $BackupPath) {
    $timestamp = (Get-Date).ToString('yyyyMMddHHmmss')
    $BackupPath = "db-backup-$timestamp.dump"
  }

  Write-Output "Running pg_dump to $BackupPath (compressed custom format)..."
  & pg_dump -Fc $DbUrl -f $BackupPath
  if ($LASTEXITCODE -ne 0) {
    Write-Error "pg_dump failed with exit code $LASTEXITCODE. Aborting."
    exit $LASTEXITCODE
  }

  Write-Output "Backup saved to: $BackupPath"
}

# Run migration script
Write-Output "Running migration script..."
pnpm -s run db:migrate:apply
if ($LASTEXITCODE -ne 0) { Write-Error "Migration failed with exit code $LASTEXITCODE"; exit $LASTEXITCODE }

# Run seed script for comments
Write-Output "Running seed-comments script..."
pnpm -s run db:seed:comments:apply
if ($LASTEXITCODE -ne 0) { Write-Error "Seed failed with exit code $LASTEXITCODE"; exit $LASTEXITCODE }

Write-Output "Migrations and seeds applied successfully."
