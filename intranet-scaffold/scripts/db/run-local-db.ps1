#!/usr/bin/env pwsh
try {
	$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
	$projectRoot = Resolve-Path (Join-Path $scriptDir "..\..")
} catch {
	$projectRoot = Get-Location
}

Write-Output "Helper: starting local Postgres (docker) from: $projectRoot"

# Check docker executable
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
	Write-Error "Docker CLI not found. Install Docker Desktop or Docker Engine and ensure 'docker' is on PATH."
	exit 1
}

# Check docker daemon availability
$dockerInfo = & docker info 2>&1
if ($LASTEXITCODE -ne 0) {
		Write-Error "Docker daemon does not appear to be running or is inaccessible. Output from 'docker info':"
		if ($dockerInfo -is [System.Array]) { foreach ($line in $dockerInfo) { Write-Error $line } } else { Write-Error $dockerInfo }
	Write-Output "If you're on Windows, ensure Docker Desktop is started, or that the Docker daemon is available via WSL."
	exit 1
}

Push-Location $projectRoot
Write-Output "Starting Postgres service using docker compose..."
docker compose up -d db
if ($LASTEXITCODE -ne 0) {
	Write-Error "Failed to start docker compose services."
	Pop-Location
	exit 1
}

Write-Output "Waiting for Postgres to be ready..."
Start-Sleep -Seconds 5
Write-Output "Exporting DATABASE_URL environment variable for this session"
$env:DATABASE_URL = "postgres://intranet:intranet_pass@localhost:5432/intranet_db"
Write-Output "DATABASE_URL set to $env:DATABASE_URL"
Pop-Location
