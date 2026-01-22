# How to Run HUMANEX BOT v5.0 (Not v4.0!)

## ⚠️ IMPORTANT: Are You Seeing the "Old Bot"?

If you're seeing an old bot interface, you're likely running **Humanex_v4.0.py** which is the **legacy version**.

This guide will help you run the **NEW v5.0 web application** instead!

---

## What's the Difference?

### ❌ v4.0 (Old - Legacy Python App)
- Desktop application using PyQt5
- File: `Humanex_v4.0.py`
- Old interface
- **This is what you DON'T want to run!**

### ✅ v5.0 (New - Modern Web App)
- Modern web application
- React frontend + Node.js backend
- JARVIS-inspired futuristic UI
- Visual RPA Script Builder
- Real-time monitoring dashboard
- **This is what you SHOULD run!**

---

## How to Run v5.0

### Method 1: Use Startup Scripts (EASIEST!)

#### On Linux/Mac:
```bash
./start.sh
```

#### On Windows:
```cmd
start.bat
```

The scripts will automatically:
- Check if Node.js is installed
- Install all dependencies
- Install Playwright browsers
- Start both backend and frontend servers

### Method 2: Manual Installation

If the startup scripts don't work, follow these steps:

#### Step 1: Check Prerequisites
```bash
# Make sure you have Node.js 16+ installed
node -v
npm -v
```

If not installed, download from: https://nodejs.org/

#### Step 2: Install Dependencies
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..

# Install Playwright browsers
npx playwright install chromium
```

#### Step 3: Start the Application
```bash
npm run dev
```

This will start:
- **Backend**: http://localhost:3000
- **Frontend**: http://localhost:5173

#### Step 4: Open Your Browser
Open your browser and go to:
```
http://localhost:5173
```

You should see the beautiful JARVIS-inspired UI!

---

## Production Mode

To run in production mode:

```bash
# Build the frontend
npm run build

# Start production server
npm start
```

Access at: http://localhost:3000

---

## What If I Still See the Old Bot?

If you're still seeing the old bot interface:

1. **Make sure you're NOT running `Humanex_v4.0.py`**
   - This is the old Python script
   - It will show a warning and ask if you want to continue

2. **Make sure you're accessing the correct URL**
   - Development: http://localhost:5173
   - Production: http://localhost:3000

3. **Check that both servers started successfully**
   - You should see messages about backend on port 3000
   - And frontend on port 5173

---

## Troubleshooting

### Port Already in Use
If port 3000 or 5173 is already in use, you can change them:

Create a `.env` file in the root directory:
```env
PORT=3001
```

### Playwright Not Installed
```bash
npx playwright install chromium
```

### Dependencies Error
```bash
# Remove node_modules and reinstall
rm -rf node_modules frontend/node_modules
npm install
cd frontend && npm install && cd ..
```

### Still Having Issues?
1. Check the README.md for full documentation
2. Check QUICKSTART.md for a 5-minute setup guide
3. Make sure Node.js 16+ is installed
4. Make sure you have at least 4GB RAM available

---

## Quick Checklist

- [ ] Node.js 16+ installed
- [ ] Ran `npm install` in root directory
- [ ] Ran `npm install` in frontend directory
- [ ] Ran `npx playwright install chromium`
- [ ] Started with `npm run dev` or startup scripts
- [ ] Opened http://localhost:5173 in browser
- [ ] See the modern JARVIS-inspired UI

---

## Need More Help?

- **Full Documentation**: See README.md
- **Quick Start Guide**: See QUICKSTART.md
- **Sample Scripts**: Check the `sample_scripts/` directory

---

**Remember: Don't run `Humanex_v4.0.py` unless you specifically need the legacy v4.0!**

The new v5.0 is better in every way! 🚀
