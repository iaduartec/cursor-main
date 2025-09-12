# PowerShell script to help migrate from Neon (Vercel Postgres) to Supabase
# Usage:
# .\migrate-neon-to-supabase.ps1 -SourceUrl <NEON_URL> -TargetUrl <SUPABASE_URL>
param(
  [Parameter(Mandatory=$true)] [string]$SourceUrl,
  [Parameter(Mandatory=$true)] [string]$TargetUrl,
  [string]$DumpFile = "neon_dump.dump"
)

Write-Host "Dumping source DB..."
pg_dump --format=custom --no-owner --no-privileges --file=$DumpFile $SourceUrl
if ($LASTEXITCODE -ne 0) { throw "pg_dump failed" }

Write-Host "Restoring to target DB..."
pg_restore --clean --no-owner --no-privileges --dbname=$TargetUrl $DumpFile
if ($LASTEXITCODE -ne 0) { throw "pg_restore failed" }

Write-Host "Migration complete. Verify permissions and extensions in the target DB."
