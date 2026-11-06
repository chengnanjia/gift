@echo off
cd /d "%~dp0"

echo Wedding Gift Book startup
echo =========================
echo.

rem Use ASCII-only output to avoid legacy Windows code-page decoding issues.
echo Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js was not found. Install it from https://nodejs.org/
    pause
    exit /b 1
)
echo Node.js is available.

echo Checking npm...
npm --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: npm was not found. Reinstall Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Checking project dependencies...
if not exist "node_modules" (
    echo Dependencies are missing. Running npm install...
    npm install
    if errorlevel 1 (
        echo ERROR: Dependency installation failed. Check your network and npm output.
        pause
        exit /b 1
    )
    echo Dependencies installed.
)

echo Starting the backend...
echo The default address is http://localhost:3000
echo Press Ctrl+C to stop the server.
echo.
npm start
if errorlevel 1 (
    echo ERROR: The backend stopped with an error.
)
pause
