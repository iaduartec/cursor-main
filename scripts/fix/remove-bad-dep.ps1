Write-Host "This script has been retired and removed during the Supabase -> Neon migration."
Write-Host "If you find leftover package.json entries referencing deprecated drivers, please remove them manually and run 'pnpm install'."
Write-Host "This script was archived to archive/supabase-refs/remove-bad-dep.ps1 during Supabase cleanup."# Remove @supabase/postgres-js line from package.json (backup then replace)
param(
  [string]$ProjectRoot = "$(Resolve-Path ..)"
)
Set-Location $PSScriptRoot
$pkg = Join-Path $PSScriptRoot '..\package.json' | Resolve-Path
$pkgPath = $pkg.Path
$bak = "$pkgPath.bak"
Write-Host "Backing up $pkgPath to $bak"
Copy-Item $pkgPath $bak -Force

$content = Get-Content $pkgPath -Raw
if ($content -match "@supabase/postgres-js") {
  Write-Host "Found @supabase/postgres-js, removing..."
  $new = $content -replace '"@supabase/postgres-js"\s*:\s*"[^"]+",?\s*', ''
  Set-Content -Path $pkgPath -Value $new -Force
  Write-Host "Updated package.json. Running pnpm install..."
  pnpm install
} else {
  Write-Host "No @supabase/postgres-js found in package.json. Running pnpm install to be safe..."
  pnpm install
}

Write-Host "Done. If pnpm still fails, open pnpm-lock.yaml and search for @supabase/postgres-js and remove entries manually."