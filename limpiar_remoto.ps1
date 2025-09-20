param(
    [string]$Remote = "origin",
    [switch]$DryRun
)

# Listar ramas remotas (excluyendo main/master)
$branches = git branch -r | Where-Object { $_ -notmatch "/(main|master)$" } | ForEach-Object { $_.Trim() -replace "$Remote/", "" }

# Listar tags remotos
$tags = git ls-remote --tags $Remote | ForEach-Object {
    ($_ -split "refs/tags/")[1] -replace "\^\{\}$", ""
} | Where-Object { $_ }

Write-Host "Ramas remotas a eliminar:" -ForegroundColor Cyan
$branches | ForEach-Object { Write-Host $_ }

Write-Host "`nTags remotos a eliminar:" -ForegroundColor Cyan
$tags | ForEach-Object { Write-Host $_ }

if ($DryRun) {
    Write-Host "`nModo dry-run: No se eliminará nada." -ForegroundColor Yellow
} else {
    Write-Host "`nEliminando ramas remotas..." -ForegroundColor Red
    foreach ($branch in $branches) {
        git push $Remote --delete $branch
    }
    Write-Host "Eliminando tags remotos..." -ForegroundColor Red
    foreach ($tag in $tags) {
        git push $Remote :refs/tags/$tag
    }
    Write-Host "¡Limpieza completada!" -ForegroundColor Green
}
