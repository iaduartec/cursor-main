# Wait for /api/_debug/ready and then POST a test project. Outputs to stdout and writes post-result.json
$uriReady = 'http://localhost:3000/api/_debug/ready'
$projUri = 'http://localhost:3000/api/projects'
$hdr = @{ 'x-debug-token' = $env:INTRANET_DEBUG_TOKEN }
$timeout = 30
$end = [DateTime]::UtcNow.AddSeconds($timeout)
Write-Output "Waiting up to $timeout seconds for $uriReady"
while([DateTime]::UtcNow -lt $end){
    try{
        $r = Invoke-RestMethod -Method Get -Uri $uriReady -Headers $hdr -TimeoutSec 3
        Write-Output "READY_RESPONSE: $r"
        break
    } catch { Start-Sleep -Seconds 1 }
}

if(-not $r){
    Write-Output "Server not ready after $timeout seconds"
    exit 2
}

$body = @{ title = 'e2e-test'; slug = ('e2e-'+([guid]::NewGuid().ToString().Substring(0,8))); description = 'automated test' } | ConvertTo-Json
try{
    $resp = Invoke-RestMethod -Uri $projUri -Method Post -Headers $hdr -Body $body -ContentType 'application/json' -TimeoutSec 30 -ErrorAction Stop
    $out = @{ ok = $true; body = $resp }
    $out | ConvertTo-Json | Out-File -FilePath .\scripts\post-result.json -Encoding utf8
    Write-Output "POST_OK: $(ConvertTo-Json $resp)"
    exit 0
} catch {
    Write-Output "POST_FAILED: $($_.Exception.Message)"
    if ($_.Exception.Response){
        $s = $_.Exception.Response.GetResponseStream(); $rdr = New-Object System.IO.StreamReader($s); $txt = $rdr.ReadToEnd(); Write-Output "POST_BODY: $txt"; $obj = @{ ok = $false; error = $_.Exception.Message; body = $txt }; $obj | ConvertTo-Json | Out-File -FilePath .\scripts\post-result.json -Encoding utf8
    }
    exit 3
}
