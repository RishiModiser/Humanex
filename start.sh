#!/bin/bash
# HUMANEX BOT v5.0 - Startup Script

echo ""
echo "=============================================="
echo "   🚀 HUMANEX BOT v5.0 - Startup Script"
echo "=============================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "Please install Node.js 16+ from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo "✅ npm version: $(npm -v)"
echo ""

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing root dependencies..."
    npm install
    echo ""
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend && npm install && cd ..
    echo ""
fi

# Check if Playwright is installed
echo "🎭 Checking Playwright installation..."
if ! npx playwright --version &> /dev/null; then
    echo "📦 Installing Playwright browsers..."
    npx playwright install chromium
    echo ""
fi

echo "=============================================="
echo "   ✨ Starting HUMANEX BOT v5.0..."
echo "=============================================="
echo ""
echo "📍 Backend will start on: http://localhost:3000"
echo "📍 Frontend will start on: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop the application"
echo ""

# Start the application
npm run dev
