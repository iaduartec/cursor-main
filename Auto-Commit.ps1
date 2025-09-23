# Auto-Commit Generator
# Genera automáticamente mensajes de commit basados en cambios detectados

param(
    [switch]$AutoCommit,
    [switch]$DryRun,
    [string]$CustomMessage = ""
)

function Get-CommitMessage {
    param([array]$Changes)

    $stagedFiles = git diff --cached --name-only
    $modifiedFiles = git diff --name-only
    $untrackedFiles = git ls-files --others --exclude-standard

    # Clasificar cambios por tipo
    $types = @{
        "feature" = @()
        "fix" = @()
        "docs" = @()
        "style" = @()
        "refactor" = @()
        "test" = @()
        "chore" = @()
        "config" = @()
    }

    # Analizar archivos staged
    foreach ($file in $stagedFiles) {
        $fileName = Split-Path $file -Leaf
        $filePath = Split-Path $file -Parent
        $extension = [System.IO.Path]::GetExtension($file)

        # Clasificar por extensión y nombre
        switch -Regex ($file) {
            "\.(js|ts|jsx|tsx)$" {
                if ($fileName -match "test|spec") {
                    $types["test"] += $file
                } elseif ($file -match "config|package\.json|tsconfig|eslint") {
                    $types["config"] += $file
                } else {
                    $types["feature"] += $file
                }
            }
            "\.(md|mdx|txt)$" {
                $types["docs"] += $file
            }
            "\.(css|scss|sass|less|styl)$" {
                $types["style"] += $file
            }
            "\.(json|yml|yaml|xml|toml)$" {
                if ($file -match "package|pnpm|yarn|requirements") {
                    $types["config"] += $file
                } else {
                    $types["chore"] += $file
                }
            }
            default {
                if ($file -match "README|CHANGELOG|LICENSE") {
                    $types["docs"] += $file
                } elseif ($file -match "test|spec") {
                    $types["test"] += $file
                } else {
                    $types["chore"] += $file
                }
            }
        }
    }

    # Generar mensaje basado en tipos de cambios
    $messages = @()

    foreach ($type in $types.Keys) {
        if ($types[$type].Count -gt 0) {
            $count = $types[$type].Count
            $fileNames = $types[$type] | ForEach-Object { Split-Path $_ -Leaf }

            switch ($type) {
                "feature" {
                    if ($count -eq 1) {
                        $messages += "feat: add/update $($fileNames[0])"
                    } else {
                        $messages += "feat: add/update $count files"
                    }
                }
                "fix" {
                    if ($count -eq 1) {
                        $messages += "fix: update $($fileNames[0])"
                    } else {
                        $messages += "fix: update $count files"
                    }
                }
                "docs" {
                    if ($count -eq 1) {
                        $messages += "docs: update $($fileNames[0])"
                    } else {
                        $messages += "docs: update documentation ($count files)"
                    }
                }
                "style" {
                    $messages += "style: update styling ($count files)"
                }
                "refactor" {
                    $messages += "refactor: code improvements ($count files)"
                }
                "test" {
                    $messages += "test: update tests ($count files)"
                }
                "config" {
                    $messages += "config: update configuration ($count files)"
                }
                "chore" {
                    $messages += "chore: maintenance updates ($count files)"
                }
            }
        }
    }

    # Si no hay cambios clasificados, mensaje genérico
    if ($messages.Count -eq 0) {
        $messages += "chore: update files"
    }

    # Combinar mensajes si hay múltiples tipos
    if ($messages.Count -eq 1) {
        return $messages[0]
    } else {
        $primaryType = $messages[0] -replace ":.*", ""
        return "$primaryType`: update multiple file types ($($messages.Count) categories)"
    }
}

function Show-Status {
    Write-Host "📊 Estado del repositorio:" -ForegroundColor Cyan
    Write-Host "─────────────────────────" -ForegroundColor Gray

    $staged = git diff --cached --name-only | Measure-Object | Select-Object -ExpandProperty Count
    $modified = git diff --name-only | Measure-Object | Select-Object -ExpandProperty Count
    $untracked = git ls-files --others --exclude-standard | Measure-Object | Select-Object -ExpandProperty Count

    Write-Host "📁 Archivos staged: $staged" -ForegroundColor Green
    Write-Host "�� Archivos modificados: $modified" -ForegroundColor Yellow
    Write-Host "🆕 Archivos sin trackear: $untracked" -ForegroundColor Blue
    Write-Host ""
}

# Función principal
function Invoke-AutoCommit {
    # Obtener estado de archivos
    $stagedFiles = git diff --cached --name-only
    $modifiedFiles = git diff --name-only
    $untrackedFiles = git ls-files --others --exclude-standard

    if ($CustomMessage) {
        $commitMessage = $CustomMessage
    } else {
        $commitMessage = Get-CommitMessage
    }

    Show-Status

    if ($stagedFiles.Count -eq 0 -and $modifiedFiles.Count -eq 0 -and $untrackedFiles.Count -eq 0) {
        Write-Host "✨ No hay cambios para commitear" -ForegroundColor Green
        return
    }

    Write-Host "📝 Mensaje de commit generado:" -ForegroundColor Cyan
    Write-Host "  $commitMessage" -ForegroundColor White
    Write-Host ""

    if ($DryRun) {
        Write-Host "🔍 Modo dry-run: No se realizó ningún commit" -ForegroundColor Yellow
        return
    }

    if ($AutoCommit) {
        Write-Host "🚀 Ejecutando commit automático..." -ForegroundColor Green
        git add .
        git commit -m "$commitMessage"
        Write-Host "✅ Commit realizado exitosamente" -ForegroundColor Green
    } else {
        Write-Host "💡 Para hacer commit automáticamente, usa el parámetro -AutoCommit" -ForegroundColor Yellow
        Write-Host "   O ejecuta manualmente:" -ForegroundColor Gray
        Write-Host "   git add ." -ForegroundColor Gray
        Write-Host "   git commit -m '$commitMessage'" -ForegroundColor Gray
    }
}

# Ejecutar función principal
Invoke-AutoCommit
