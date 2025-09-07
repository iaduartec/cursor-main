param(
  [string]$Project = $env:PROJECT,
  [string]$Token   = $env:VERCEL_TOKEN,
  [string]$TeamId  = $env:VERCEL_TEAM_ID,
  [ValidateSet('', 'preview', 'production')]
  [string]$Target  = $env:TARGET,
  [int]$Keep       = $(if($env:KEEP){[int]$env:KEEP}else{2}),
  [switch]$DryRun
)
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
$env:VERCEL_TOKEN = "p7HcYTrsSueMuftX9dIceCaf"
$env:PROJECT      = "cursor-main"
$env:VERCEL_TEAM_ID = ""
$env:TARGET       = "preview"
$env:KEEP         = "2"


if (-not $Project) { throw "Falta PROJECT" }
if (-not $Token)   { throw "Falta VERCEL_TOKEN" }

$Headers = @{ Authorization = "Bearer $Token" }
$ListUrl = "https://api.vercel.com/v6/deployments"
$DelUrl  = "https://api.vercel.com/v13/deployments"

# Query base
$qs = @{ app = $Project; state = "READY" }
if ($Target) { $qs.target = $Target }
if ($TeamId) { $qs.teamId = $TeamId }

# --- Listado con paginación ---
$limit = 200
$until = $null
$deployments = @()
$more = $true

while ($more) {
  $params = $qs.Clone(); $params.limit = $limit
  if ($until) { $params.until = $until }

  $pairs = $params.GetEnumerator() | Sort-Object -Property Key | ForEach-Object { "$($_.Key)=$($_.Value)" }
  $url = $ListUrl + "?" + ($pairs -join "&")

  try {
    $resp = Invoke-RestMethod -Uri $url -Headers $Headers -Method Get
  } catch {
    throw "Error al listar: $($_.Exception.Message)"
  }

  if ($resp.deployments) {
    $deployments += $resp.deployments
    $oldest = ($resp.deployments | Measure-Object -Property createdAt -Minimum).Minimum
    $more = ($resp.deployments.Count -ge $limit)
    if ($more) { $until = $oldest } else { $until = $null }
  } else {
    $more = $false
  }
}

if ($deployments.Count -eq 0) { Write-Host "No hay deployments READY para $Project ($Target)."; exit 0 }

# --- Ordena DESC y decide qué borrar ---
$sorted   = $deployments | Sort-Object -Property createdAt -Descending
$keepCnt  = [Math]::Max([Math]::Min($Keep, $sorted.Count), 0)
$toDelete = if ($sorted.Count -gt $keepCnt) { $sorted[$keepCnt..($sorted.Count-1)] } else { @() }

Write-Host ("Proyecto: {0} | Target: {1}" -f $Project, $(if($Target){$Target}else{'todos'}))
Write-Host ("Total READY: {0} | Mantener: {1} | Borrar: {2}" -f $sorted.Count, $keepCnt, $toDelete.Count)
Write-Host "Muestra de IDs a borrar:"
$toDelete | Select-Object -First 10 | ForEach-Object { Write-Host ("  - {0}" -f $_.uid) }

if ($DryRun) { Write-Host "[DRY-RUN] No se borra nada."; exit 0 }

$confirm = Read-Host "Escribe BORRAR para confirmar"
if ($confirm -ne "BORRAR") { Write-Host "Cancelado."; exit 1 }

# --- Borrado ---
$ok=0; $fail=0
foreach ($d in $toDelete) {
  $u = "$DelUrl/$($d.uid)"; if ($TeamId) { $u = "$u?teamId=$TeamId" }
  try {
    $r = Invoke-RestMethod -Uri $u -Headers $Headers -Method Delete
    if ($r.state) { $ok++; Write-Host ("[OK] {0} -> {1}" -f $d.uid, $r.state) }
    else { $fail++; Write-Host ("[ERR] {0} -> sin estado" -f $d.uid) }
  } catch {
    $fail++; Write-Host ("[ERR] {0} -> {1}" -f $d.uid, $_.Exception.Message)
  }
}
Write-Host ("Hecho. Eliminados OK: {0} | Fallos: {1}" -f $ok, $fail)
