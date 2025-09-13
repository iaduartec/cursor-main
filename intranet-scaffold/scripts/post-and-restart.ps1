# Assumes dev server is started in "other console". If POST fails or doesn't respond within timeout, kill node and restart dev server, retry up to $maxRetries.
param(
    [int]$maxRetries = 3,
    [int]$postTimeoutSec = 10,
    [int]$waitForReadySec = 30
)
$env:USE_IN_MEMORY_DB = '1'
$env:INTRANET_DEBUG_TOKEN = 'test-token'

function Is-Ready(){
    $uri = 'http://localhost:3000/api/_debug/ready'
    $hdr = @{ 'x-debug-token' = $env:INTRANET_DEBUG_TOKEN }
    try{ Invoke-RestMethod -Method Get -Uri $uri -Headers $hdr -TimeoutSec 3 ; return $true } catch { return $false }
}

function Do-Post(){
    $projUri = 'http://localhost:3000/api/projects'
    $body = @{ title = 'e2e-test'; slug = ('e2e-'+([guid]::NewGuid().ToString().Substring(0,8))); description='automated test' } | ConvertTo-Json
    try{
        $resp = Invoke-RestMethod -Uri $projUri -Method Post -Headers @{ 'x-debug-token' = $env:INTRANET_DEBUG_TOKEN } -Body $body -ContentType 'application/json' -TimeoutSec $postTimeoutSec -ErrorAction Stop
        Write-Output "POST_OK: $(ConvertTo-Json $resp)"
        return @{ ok = $true }
    } catch {
        Write-Output "POST_FAILED: $($_.Exception.Message)"
        if ($_.Exception.Response){
            $s = $_.Exception.Response.GetResponseStream(); $rdr = New-Object System.IO.StreamReader($s); $txt = $rdr.ReadToEnd(); Write-Output "POST_BODY: $txt"
        }
        return @{ ok = $false }
    }
}

function Kill-Node(){
    Write-Output "Killing node processes (safe kill)..."
    try{ Get-Process -Name node -ErrorAction SilentlyContinue | ForEach-Object { Write-Output "Stopping PID $($_.Id)"; Stop-Process -Id $_.Id -Force } } catch { Write-Output "Error killing node: $_" }
}

function Start-Dev(){
    Write-Output "Starting dev server (pnpm dev) in background..."
    Start-Process -FilePath 'pwsh' -ArgumentList "-NoProfile -ExecutionPolicy Bypass -Command \"cd $(Get-Location); $env:USE_IN_MEMORY_DB='1'; $env:INTRANET_DEBUG_TOKEN='test-token'; pnpm dev\"" -NoNewWindow -WindowStyle Hidden
    # Give it a moment
    Start-Sleep -Seconds 2
}

$attempt = 0
while($attempt -lt $maxRetries){
    $attempt++
    Write-Output "=== Attempt $attempt/$maxRetries ==="

    # Wait for ready up to waitForReadySec
    $end = [DateTime]::UtcNow.AddSeconds($waitForReadySec)
    while([DateTime]::UtcNow -lt $end){ if(Is-Ready){ Write-Output 'Server ready'; break } ; Start-Sleep -Seconds 1 }

    if(-not (Is-Ready)){
        Write-Output "Server not ready after $waitForReadySec seconds. Will kill node and restart."
        Kill-Node
        Start-Dev
        Start-Sleep -Seconds 3
        continue
    }

    $res = Do-Post
    if($res.ok){ Write-Output 'POST succeeded' ; exit 0 }

    Write-Output 'POST failed or non-JSON response. Restarting server and retrying...'
    Kill-Node
    Start-Dev
    Start-Sleep -Seconds 3
}

Write-Output 'All attempts exhausted. Exiting with error.'
exit 1
