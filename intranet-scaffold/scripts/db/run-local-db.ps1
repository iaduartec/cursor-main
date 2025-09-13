#!/usr/bin/env pwsh
Write-Output "Starting local Postgres with docker-compose..."
Push-Location (Split-Path -Parent $MyInvocation.MyCommand.Path)
cd ..\..
docker compose up -d db
Write-Output "Waiting for Postgres to be ready..."
Start-Sleep -Seconds 5
Write-Output "Exporting DATABASE_URL environment variable for this session"
$env:DATABASE_URL = "postgres://intranet:intranet_pass@localhost:5432/intranet_db"
Write-Output "DATABASE_URL set to $env:DATABASE_URL"
Pop-Location
