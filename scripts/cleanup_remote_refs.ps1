<#
.SYNOPSIS
  Lista y opcionalmente elimina ramas y tags remotos en el remoto 'origin'.

.DESCRIPTION
  Este script muestra ramas y tags remotos y puede borrarlos en batch.
  Tiene un modo "dry-run" que solo muestra lo que se borraría.

.PARAMETER BranchPrefix
  Prefijo de ramas a eliminar (ej: 'fix/' para borrar origin/fix/*).

.PARAMETER TagPattern
  Pattern simple para tags (usa -like). Ejemplo: 'v1.*'.

.PARAMETER DryRun
  Si se especifica, no borra nada; solo muestra las acciones que tomaría.

.PARAMETER Force
  Omite la confirmación interactiva y procede a borrar.

.EXAMPLE
  ./cleanup_remote_refs.ps1 -BranchPrefix 'fix/' -DryRun

#>

[CmdletBinding()]
param(
  [string]$RemoteName = 'origin',
  [string]$BranchPrefix = '',
  [string]$TagPattern = '',
  [switch]$DryRun,
  [switch]$Force
)

function Get-RemoteBranches($remote) {
  git ls-remote --heads $remote | ForEach-Object {
    $parts = $_ -split "\t"
    $ref = $parts[1]
    $ref -replace '^refs/heads/', ''
  }
}

function Get-RemoteTags($remote) {
  git ls-remote --tags $remote | ForEach-Object {
    $parts = $_ -split "\t"
    $ref = $parts[1]
    $ref -replace '^refs/tags/', ''
  }
}

# Fetch remote refs first
Write-Host "Fetching remote refs from $RemoteName..." -ForegroundColor Cyan
git fetch $RemoteName --prune | Out-Null

$branches = Get-RemoteBranches $RemoteName
$tags = Get-RemoteTags $RemoteName

Write-Host "Remote branches on $RemoteName: $($branches.Count)" -ForegroundColor Green
if ($branches.Count -gt 0) { $branches | ForEach-Object { Write-Host "  $_" } }
Write-Host "Remote tags on $RemoteName: $($tags.Count)" -ForegroundColor Green
if ($tags.Count -gt 0) { $tags | ForEach-Object { Write-Host "  $_" } }

# Filter
$toDeleteBranches = @()
if ($BranchPrefix) {
  $toDeleteBranches = $branches | Where-Object { $_ -like "$BranchPrefix*" }
}

$toDeleteTags = @()
if ($TagPattern) {
  $toDeleteTags = $tags | Where-Object { $_ -like $TagPattern }
}

if (-not $BranchPrefix -and -not $TagPattern) {
  Write-Host "No BranchPrefix or TagPattern provided — nothing to delete." -ForegroundColor Yellow
  exit 0
}

Write-Host "Candidates to delete:" -ForegroundColor Magenta
if ($toDeleteBranches.Count -gt 0) {
  Write-Host "Branches ($($toDeleteBranches.Count)):