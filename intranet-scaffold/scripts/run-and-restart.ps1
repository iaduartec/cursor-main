# Run Next dev, wait for readiness, POST a test project, and restart on error (max retries)
param(
    [int]$maxRetries = 3,
    [int]$waitSeconds = 60
)
$env:USE_IN_MEMORY_DB = '1'
$env:INTRANET_DEBUG_TOKEN = 'test-token'

function Start-DevServer {
    Write-Output "Starting dev server..."
    $startInfo = New-Object System.Diagnostics.ProcessStartInfo
    $startInfo.FileName = 'pnpm'
    $startInfo.Arguments = 'dev'
    $startInfo.WorkingDirectory = (Get-Location).Path
    $startInfo.RedirectStandardOutput = $true
    $startInfo.RedirectStandardError = $true
    $startInfo.UseShellExecute = $false
    $startInfo.CreateNoWindow = $true

    $proc = New-Object System.Diagnostics.Process
    $proc.StartInfo = $startInfo
    $proc.EnableRaisingEvents = $true
    $proc.Start() | Out-Null
    Start-Sleep -Seconds 1
    return $proc
}

function Stop-Proc($proc){
    try{
        if($proc -and !$proc.HasExited){
            Write-Output "Stopping PID $($proc.Id)"
            $proc.Kill()
            $proc.WaitForExit(5000)
        }
    } catch { Write-Output "Failed stopping process: $_" }
}

function Wait-Ready($timeoutSec=40){
    $uri = 'http://localhost:3000/api/_debug/ready'
    $hdr = @{ 'x-debug-token' = $env:INTRANET_DEBUG_TOKEN }
    $end = [DateTime]::UtcNow.AddSeconds($timeoutSec)
    while([DateTime]::UtcNow -lt $end){
        try{
            $r = Invoke-RestMethod -Method Get -Uri $uri -Headers $hdr -TimeoutSec 3
            Write-Output "READY: $r"
            return $true
        } catch { Start-Sleep -Seconds 1 }
    }
    return $false
}

function Do-PostTest(){
    $projUri = 'http://localhost:3000/api/projects'
    $body = @{ title = 'e2e-test'; slug = ('e2e-'+([guid]::NewGuid().ToString().Substring(0,8))); description='automated test' } | ConvertTo-Json
    try{
        $resp = Invoke-RestMethod -Uri $projUri -Method Post -Headers @{ 'x-debug-token' = $env:INTRANET_DEBUG_TOKEN } -Body $body -ContentType 'application/json' -TimeoutSec 30 -ErrorAction Stop
        Write-Output "POST_OK: $(ConvertTo-Json $resp)"
        return @{ ok = $true; status = 201 }
    } catch {
        Write-Output "POST_FAILED: $($_.Exception.Message)"
        if ($_.Exception.Response){
            $s = $_.Exception.Response.GetResponseStream(); $rdr = New-Object System.IO.StreamReader($s); $txt = $rdr.ReadToEnd(); Write-Output "POST_BODY: $txt"
        }
        return @{ ok = $false }
    }
}

$attempt = 0
while($attempt -lt $maxRetries){
    $attempt++
    Write-Output "=== Attempt $attempt/$maxRetries ==="
    $proc = Start-DevServer

    if(-not (Wait-Ready -timeoutSec $waitSeconds)){
        Write-Output "Server did not become ready within $waitSeconds seconds. Stopping and retrying."
        Stop-Proc $proc
        continue
    }

    $res = Do-PostTest
    if($res.ok){
        Write-Output "Test POST succeeded. Keeping server running (PID $($proc.Id))."
        exit 0
    } else {
        Write-Output "POST failed; stopping server and retrying..."
        Stop-Proc $proc
        Start-Sleep -Seconds 2
        continue
    }
}

Write-Output "All attempts failed. Exiting with error."
exit 1
