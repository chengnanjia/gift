Write-Host "Wedding Gift Book startup" -ForegroundColor Green
Write-Host "=========================" -ForegroundColor Green
Write-Host ""

Set-Location $PSScriptRoot

Write-Host "Checking Node.js..." -ForegroundColor Cyan
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: Node.js was not found. Install it from https://nodejs.org/" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
$nodeVersion = node --version
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Could not run Node.js." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "Node.js is available: $nodeVersion" -ForegroundColor Green

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: npm was not found. Reinstall Node.js from https://nodejs.org/" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "Checking project dependencies..." -ForegroundColor Cyan
if (-not (Test-Path "node_modules")) {
    Write-Host "Dependencies are missing. Running npm install..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Dependency installation failed. Check your network and npm output." -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
} else {
    Write-Host "Dependencies are already installed." -ForegroundColor Green
}

Write-Host "Starting the backend..." -ForegroundColor Cyan
Write-Host "The default address is http://localhost:3000" -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop the server." -ForegroundColor Yellow
Write-Host ""
npm start
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: The backend stopped with exit code $LASTEXITCODE." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}