# Java 21 Installation Verification Script
# This script verifies that Java 21 LTS is properly installed and configured

Write-Host "=== Java 21 LTS Installation Verification ===" -ForegroundColor Green
Write-Host ""

# Check Java version
Write-Host "Java Runtime Version:" -ForegroundColor Cyan
try {
    $javaVersion = & java -version 2>&1
    $javaVersion | ForEach-Object { Write-Host "  $_" -ForegroundColor White }
} catch {
    Write-Host "  ERROR: Java not found in PATH" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Check Java Compiler version
Write-Host "Java Compiler Version:" -ForegroundColor Cyan
try {
    $javacVersion = & javac -version 2>&1
    Write-Host "  $javacVersion" -ForegroundColor White
} catch {
    Write-Host "  ERROR: Java compiler not found in PATH" -ForegroundColor Red
}

Write-Host ""

# Check JAVA_HOME
Write-Host "JAVA_HOME Environment Variable:" -ForegroundColor Cyan
$javaHome = [Environment]::GetEnvironmentVariable("JAVA_HOME", "User")
if ($javaHome) {
    Write-Host "  User Level: $javaHome" -ForegroundColor White
} else {
    Write-Host "  User Level: Not set" -ForegroundColor Yellow
}

$javaHomeSystem = [Environment]::GetEnvironmentVariable("JAVA_HOME", "Machine")
if ($javaHomeSystem) {
    Write-Host "  System Level: $javaHomeSystem" -ForegroundColor White
} else {
    Write-Host "  System Level: Not set" -ForegroundColor Yellow
}

Write-Host ""

# Check PATH contains Java
Write-Host "Java in PATH:" -ForegroundColor Cyan
$currentPath = [Environment]::GetEnvironmentVariable("PATH", "Process")
$javaPaths = $currentPath -split ';' | Where-Object { $_ -like "*java*" -or $_ -like "*jdk*" }
if ($javaPaths) {
    $javaPaths | ForEach-Object { Write-Host "  $_" -ForegroundColor White }
} else {
    Write-Host "  No Java paths found in current PATH" -ForegroundColor Yellow
}

Write-Host ""

# Check JDK installation directory
Write-Host "JDK Installation:" -ForegroundColor Cyan
$jdk21Path = "C:\Program Files\Microsoft\jdk-21.0.8.9-hotspot"
if (Test-Path $jdk21Path) {
    Write-Host "  ✓ Found at: $jdk21Path" -ForegroundColor Green
    
    # List key directories
    $binPath = Join-Path $jdk21Path "bin"
    $libPath = Join-Path $jdk21Path "lib"
    
    if (Test-Path $binPath) {
        Write-Host "  ✓ bin/ directory exists" -ForegroundColor Green
    } else {
        Write-Host "  ✗ bin/ directory missing" -ForegroundColor Red
    }
    
    if (Test-Path $libPath) {
        Write-Host "  ✓ lib/ directory exists" -ForegroundColor Green
    } else {
        Write-Host "  ✗ lib/ directory missing" -ForegroundColor Red
    }
} else {
    Write-Host "  ✗ JDK 21 installation not found at expected location" -ForegroundColor Red
}

Write-Host ""

# Java feature verification
Write-Host "Java 21 LTS Features Test:" -ForegroundColor Cyan

# Create a simple test program that uses Java 21 features
$testCode = @'
public class Java21Test {
    public static void main(String[] args) {
        // String Templates (Preview in Java 21)
        String name = "Java";
        int version = 21;
        System.out.println("Running " + name + " " + version + " LTS");
        
        // Pattern Matching for switch (Standard in Java 21)
        Object obj = "test";
        String result = switch (obj) {
            case String s -> "String: " + s;
            case Integer i -> "Integer: " + i;
            default -> "Unknown";
        };
        System.out.println("Pattern matching result: " + result);
        
        // Record pattern matching (Preview in Java 21)
        record Point(int x, int y) {}
        Point point = new Point(10, 20);
        System.out.println("Point: " + point);
        
        System.out.println("✓ Java 21 features working correctly!");
    }
}
'@

$testFile = Join-Path $env:TEMP "Java21Test.java"
$testCode | Out-File -FilePath $testFile -Encoding UTF8

try {
    # Compile
    Write-Host "  Compiling test program..." -ForegroundColor White
    $compileResult = & javac $testFile 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✓ Compilation successful" -ForegroundColor Green
        
        # Run
        Write-Host "  Running test program..." -ForegroundColor White
        $classDir = Split-Path $testFile
        $runResult = & java -cp $classDir Java21Test 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  ✓ Execution successful" -ForegroundColor Green
            $runResult | ForEach-Object { Write-Host "    $_" -ForegroundColor Gray }
        } else {
            Write-Host "  ✗ Execution failed" -ForegroundColor Red
            $runResult | ForEach-Object { Write-Host "    $_" -ForegroundColor Red }
        }
    } else {
        Write-Host "  ✗ Compilation failed" -ForegroundColor Red
        $compileResult | ForEach-Object { Write-Host "    $_" -ForegroundColor Red }
    }
} catch {
    Write-Host "  ✗ Test execution failed: $_" -ForegroundColor Red
} finally {
    # Cleanup
    Remove-Item $testFile -ErrorAction SilentlyContinue
    Remove-Item (Join-Path $env:TEMP "Java21Test.class") -ErrorAction SilentlyContinue
}

Write-Host ""
Write-Host "=== Verification Complete ===" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Restart your terminal/IDE to pick up environment variables" -ForegroundColor White
Write-Host "2. For system-wide setup, run as Administrator:" -ForegroundColor White
Write-Host "   .\setup-java21.ps1 -SystemWide" -ForegroundColor Cyan
Write-Host "3. Update your IDE/build tools to use Java 21" -ForegroundColor White