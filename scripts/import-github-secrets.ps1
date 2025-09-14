param(
    [string]$EnvPath = ".env",
    [string]$RepoOwner = "",
    [string]$RepoName = "",
    [switch]$DryRun
)

if (-not (Test-Path $EnvPath)) {
    Write-Error "Archivo de entorno no encontrado: $EnvPath"
    exit 1
}

# Leer .env (parse simple: KEY=VALUE, soporta comillas)
$lines = Get-Content -Path $EnvPath -ErrorAction Stop
$pairs = @{}
foreach ($line in $lines) {
    $trim = $line.Trim()
    if ($trim -eq '' -or $trim.StartsWith('#')) { continue }
    if ($trim -match '^(?<k>[^=]+)=(?<v>.*)$') {
        $k = $Matches['k'].Trim()
        $v = $Matches['v'].Trim()
        if ($v.StartsWith('"') -and $v.EndsWith('"')) { $v = $v.Substring(1, $v.Length - 2) }
        if ($v.StartsWith("'") -and $v.EndsWith("'")) { $v = $v.Substring(1, $v.Length - 2) }
        $pairs[$k] = $v
    }
}

# Mapeo recomendado
$mapping = @{
    'cxz_POSTGRES_URL_NON_POOLING' = 'SUPABASE_DB_URL'
    'cxz_POSTGRES_URL' = 'SUPABASE_DB_URL'            # fallback
    'cxz_POSTGRES_PRISMA_URL' = 'POSTGRES_PRISMA_URL'
    'cxz_SUPABASE_SERVICE_ROLE_KEY' = 'SUPABASE_SERVICE_ROLE_KEY'
    'cxz_SUPABASE_URL' = 'SUPABASE_URL'
    'cxz_NEXT_PUBLIC_SUPABASE_ANON_KEY' = 'NEXT_PUBLIC_SUPABASE_ANON_KEY'
    'cxz_SUPABASE_JWT_SECRET' = 'SUPABASE_JWT_SECRET'
}

$toUpload = @{}
foreach ($src in $mapping.Keys) {
    if ($pairs.ContainsKey($src) -and -not [string]::IsNullOrWhiteSpace($pairs[$src])) {
        $dest = $mapping[$src]
        if (-not $toUpload.ContainsKey($dest)) { $toUpload[$dest] = $pairs[$src] }
    }
}

if ($toUpload.Count -eq 0) {
    Write-Host "No se encontraron variables mapeables en $EnvPath"
    exit 0
}

Write-Host "Variables encontradas y mapeadas:"
foreach ($k in $toUpload.Keys) { Write-Host "  $k -> (length: $($toUpload[$k].Length))" }

if ($DryRun) {
    Write-Host "`nDry-run activado. No se subirán secrets. Para subir, vuelve a ejecutar sin -DryRun y asegúrate de haber hecho 'gh auth login'."
    exit 0
}

if ([string]::IsNullOrWhiteSpace($RepoOwner) -or [string]::IsNullOrWhiteSpace($RepoName)) {
    Write-Host "Falta --RepoOwner o --RepoName. Ejemplo: -RepoOwner iaduartec -RepoName cursor-main"
    exit 1
}

# Comprobar gh
try {
    $null = gh --version 2>$null
} catch {
    Write-Error "La CLI 'gh' no está instalada o no está en PATH. Instala desde https://cli.github.com/"
    exit 1
}

foreach ($secretName in $toUpload.Keys) {
    $value = $toUpload[$secretName]
    Write-Host "Subiendo secret $secretName to $RepoOwner/$RepoName ..."
    try {
        # Usar --body para pasar el valor directamente; más fiable en PowerShell.
        $output = gh secret set $secretName --repo "$RepoOwner/$RepoName" --body "$value" 2>&1
        $exit = $LASTEXITCODE
        if ($exit -ne 0) {
            Write-Error "Error subiendo $secretName (exit $exit). gh output: $output"
            exit $exit
        }
        Write-Host "$secretName subido correctamente."
    } catch {
        Write-Error "Excepción subiendo $secretName: $($_.Exception.Message)"
        exit 1
    }
}

Write-Host "Todos los secrets subidos con éxito."
