# Simple dump and restore helper
param(
  [Parameter(Mandatory=$true)] [string]$DumpFile,
  [Parameter(Mandatory=$true)] [string]$TargetUrl
)

if (-not (Test-Path $DumpFile)) { throw "Dump file $DumpFile not found" }

Write-Host "Restoring $DumpFile to $TargetUrl"
pg_restore --clean --no-owner --no-privileges --dbname=$TargetUrl $DumpFile
if ($LASTEXITCODE -ne 0) { throw "pg_restore failed" }
Write-Host "Done"