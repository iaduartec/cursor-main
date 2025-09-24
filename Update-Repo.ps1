param(
    [switch]$Force,
    [switch]$StatusOnly
)

Write-Host "🔄 Actualizando repositorio local..." -ForegroundColor Cyan

# Verificar estado inicial
Write-Host "📊 Estado inicial:" -ForegroundColor Yellow
git status --porcelain
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al verificar estado del repositorio" -ForegroundColor Red
    exit 1
}

# Verificar si hay cambios sin commitear
$status = git status --porcelain
if ($status -and -not $Force) {
    Write-Host ""
    Write-Host "⚠️  Hay cambios sin guardar:" -ForegroundColor Yellow
    Write-Host $status -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Usa -Force para continuar de todos modos, o guarda tus cambios primero" -ForegroundColor Cyan
    exit 1
}

if ($StatusOnly) {
    Write-Host "📋 Modo status only - No se realizó actualización" -ForegroundColor Green
    exit 0
}

# Fetch de cambios remotos
Write-Host ""
Write-Host "📥 Descargando cambios del remoto..." -ForegroundColor Green
git fetch origin
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al hacer fetch" -ForegroundColor Red
    exit 1
}

# Rebase
Write-Host "🔄 Aplicando cambios locales sobre la versión remota..." -ForegroundColor Green
git rebase origin/main
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error durante el rebase. Posibles conflictos que resolver." -ForegroundColor Red
    Write-Host "💡 Ejecuta 'git status' para ver qué archivos tienen conflictos" -ForegroundColor Yellow
    exit 1
}

# Verificar estado final
Write-Host ""
Write-Host "✅ Actualización completada exitosamente!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Estado final:" -ForegroundColor Yellow
git status --short
Write-Host ""
Write-Host "🎯 Listo para trabajar en local" -ForegroundColor Green
