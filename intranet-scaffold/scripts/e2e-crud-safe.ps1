Param(
  [int]$TimeoutSeconds = 30
)

$base = 'http://127.0.0.1:3000'
$hdr = @{ 'Content-Type' = 'application/json' }

function Wait-ForServer {
  param([int]$secs = 30)
  $end = (Get-Date).AddSeconds($secs)
  while ((Get-Date) -lt $end) {
    try {
      $r = Invoke-WebRequest -Uri "$base/api/projects" -Method Get -UseBasicParsing -TimeoutSec 3 -ErrorAction Stop
      if ($r.StatusCode -ge 200 -and $r.StatusCode -lt 300) { Write-Output "server ready"; return $true }
    } catch {
      Start-Sleep -Milliseconds 500
    }
  }
  throw "Server did not respond within $secs seconds"
}

Write-Output "Waiting for server (up to $TimeoutSeconds s)..."
Wait-ForServer -secs $TimeoutSeconds

Write-Output 'CREATE'
$body = @{ slug = 'test-slug-copilot'; title = 'Test Project from Copilot' }
$create = Invoke-RestMethod -Method Post -Uri "$base/api/projects" -Headers $hdr -Body ($body | ConvertTo-Json)
$create | ConvertTo-Json

Write-Output 'LIST AFTER CREATE'
(Invoke-RestMethod -Method Get -Uri "$base/api/projects") | ConvertTo-Json

Write-Output 'UPDATE'
$id = $create.id
$updBody = @{ slug = 'test-slug-copilot-upd'; title = 'Updated Title' }
$upd = Invoke-RestMethod -Method Put -Uri "$base/api/projects/$id" -Headers $hdr -Body ($updBody | ConvertTo-Json)
$upd | ConvertTo-Json

Write-Output 'LIST AFTER UPDATE'
(Invoke-RestMethod -Method Get -Uri "$base/api/projects") | ConvertTo-Json

Write-Output 'DELETE'
(Invoke-RestMethod -Method Delete -Uri "$base/api/projects/$id") | ConvertTo-Json

Write-Output 'LIST AFTER DELETE'
(Invoke-RestMethod -Method Get -Uri "$base/api/projects") | ConvertTo-Json
