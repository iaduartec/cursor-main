# Setup Java 21 Environment Variables
# Run this script as Administrator to set system-wide environment variables

param(
    [switch]$SystemWide = $false
)

$javaHome = "C:\Program Files\Microsoft\jdk-21.0.8.9-hotspot"

if ($SystemWide) {
    # Set system-wide environment variables (requires admin)
    Write-Host "Setting system-wide environment variables..." -ForegroundColor Green
    [Environment]::SetEnvironmentVariable("JAVA_HOME", $javaHome, "Machine")
    
    # Get current system PATH
    $currentSystemPath = [Environment]::GetEnvironmentVariable("Path", "Machine")
    
    # Remove old Java paths
    $newPath = $currentSystemPath -split ';' | Where-Object { 
        $_ -notlike "*\java\bin*" -and 
        $_ -notlike "*\jdk*\bin*" -and 
        $_ -notlike "*\Zulu\*\bin*"
    } | ForEach-Object { $_.Trim() }
    
    # Add new Java 21 path at the beginning
    $newPath = @("$javaHome\bin") + $newPath
    $finalPath = $newPath -join ';'
    
    [Environment]::SetEnvironmentVariable("Path", $finalPath, "Machine")
    Write-Host "System environment variables set successfully!" -ForegroundColor Green
} else {
    # Set user-level environment variables
    Write-Host "Setting user-level environment variables..." -ForegroundColor Yellow
    [Environment]::SetEnvironmentVariable("JAVA_HOME", $javaHome, "User")
    
    # Get current user PATH
    $currentUserPath = [Environment]::GetEnvironmentVariable("Path", "User")
    
    # Remove old Java paths if they exist
    if ($currentUserPath) {
        $newPath = $currentUserPath -split ';' | Where-Object { 
            $_ -notlike "*\java\bin*" -and 
            $_ -notlike "*\jdk*\bin*" -and 
            $_ -notlike "*\Zulu\*\bin*"
        } | ForEach-Object { $_.Trim() }
        
        # Add new Java 21 path at the beginning
        $newPath = @("$javaHome\bin") + $newPath
        $finalPath = $newPath -join ';'
    } else {
        $finalPath = "$javaHome\bin"
    }
    
    [Environment]::SetEnvironmentVariable("Path", $finalPath, "User")
    Write-Host "User environment variables set successfully!" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "To apply changes system-wide, run as Administrator:" -ForegroundColor Cyan
Write-Host "  .\setup-java21.ps1 -SystemWide" -ForegroundColor Cyan
Write-Host ""
Write-Host "Restart your terminal/IDE to pick up the new environment variables." -ForegroundColor Magenta
Write-Host ""
Write-Host "Current session verification:" -ForegroundColor White
$env:JAVA_HOME = $javaHome
$env:PATH = "$javaHome\bin;$env:PATH"
& java -version