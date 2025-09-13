#!/usr/bin/env pwsh
try {
  $scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
  $projectRoot = Resolve-Path (Join-Path $scriptDir "..\..")
} catch {
  $projectRoot = Get-Location
}

Write-Output "[start-dev] Project root: $projectRoot"

Write-Output "[start-dev] Looking for processes listening on port 3000..."
$connections = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | Where-Object { $_.State -eq 'Listen' -or $_.State -eq 'Established' }
if ($connections) {
  $pids = $connections | Select-Object -ExpandProperty OwningProcess -Unique
  foreach ($pid in $pids) {
    try {
      $proc = Get-Process -Id $pid -ErrorAction Stop
      Write-Output "[start-dev] Stopping PID $pid ($($proc.ProcessName))"
      Stop-Process -Id $pid -Force -ErrorAction Stop
    } catch {
      Write-Output "[start-dev] Could not stop PID $pid: $_"
    }
  }
} else {
  Write-Output "[start-dev] No process found listening on port 3000."
}

Write-Output "[start-dev] Changing directory to project root and starting dev..."
Set-Location $projectRoot

Write-Output "[start-dev] Running 'pnpm dev' (this will keep the terminal occupied)..."
& pnpm dev
