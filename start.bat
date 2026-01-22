@echo off
REM HUMANEX BOT v5.0 - Startup Script for Windows

echo.
echo ==============================================
echo    🚀 HUMANEX BOT v5.0 - Startup Script
echo ==============================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed!
    echo Please install Node.js 16+ from: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js version:
node -v
echo ✅ npm version:
npm -v
echo.

REM Check if dependencies are installed
if not exist "node_modules" (
    echo 📦 Installing root dependencies...
    call npm install
    echo.
)

if not exist "frontend\node_modules" (
    echo 📦 Installing frontend dependencies...
    cd frontend
    call npm install
    cd ..
    echo.
)

REM Check if Playwright is installed
echo 🎭 Checking Playwright installation...
npx playwright --version >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo 📦 Installing Playwright browsers...
    call npx playwright install chromium
    echo.
)

echo ==============================================
echo    ✨ Starting HUMANEX BOT v5.0...
echo ==============================================
echo.
echo 📍 Backend will start on: http://localhost:3000
echo 📍 Frontend will start on: http://localhost:5173
echo.
echo Press Ctrl+C to stop the application
echo.

REM Start the application
call npm run dev
