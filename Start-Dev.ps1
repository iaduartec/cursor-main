Write-Host "🚀 Iniciando entorno de desarrollo local..." -ForegroundColor Green
Write-Host ""

# Verificar estado del repositorio
Write-Host "📊 Verificando estado del repositorio..." -ForegroundColor Cyan
git status --short
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error: No es un repositorio git válido" -ForegroundColor Red
    exit 1
}

# Actualizar repositorio si es necesario
$status = git status --porcelain
if (-not $status) {
    Write-Host ""
    Write-Host "✅ Repositorio limpio, verificando actualizaciones remotas..." -ForegroundColor Green
    git fetch origin --quiet
    $behind = git rev-list HEAD..origin/main --count
    if ($behind -gt 0) {
        Write-Host "📥 Hay $behind cambios remotos disponibles" -ForegroundColor Yellow
        Write-Host "💡 Ejecuta .\Update-Repo.ps1 para actualizar" -ForegroundColor Cyan
    } else {
        Write-Host "✅ Repositorio actualizado" -ForegroundColor Green
    }
} else {
    Write-Host ""
    Write-Host "⚠️  Hay cambios locales pendientes:" -ForegroundColor Yellow
    Write-Host $status -ForegroundColor Red
}

Write-Host ""
Write-Host "🛠️  Scripts disponibles:" -ForegroundColor Cyan
Write-Host "  .\Update-Repo.ps1     - Actualizar repositorio" -ForegroundColor White
Write-Host "  .\Auto-Commit.ps1     - Gestionar commits" -ForegroundColor White
Write-Host "  git autocommit        - Commit automático" -ForegroundColor White
Write-Host "  git genmsg           - Generar mensaje de commit" -ForegroundColor White

Write-Host ""
Write-Host "🌐 Servidor de desarrollo:" -ForegroundColor Cyan
Write-Host "  pnpm dev             - Iniciar servidor (http://localhost:3000)" -ForegroundColor White
Write-Host "  pnpm build           - Build de producción" -ForegroundColor White
Write-Host "  pnpm test            - Ejecutar tests" -ForegroundColor White

Write-Host ""
Write-Host "📚 Documentación: CONTROL_REPO.md" -ForegroundColor Magenta
Write-Host ""
Write-Host "🎯 ¡Listo para trabajar en local!" -ForegroundColor Green
