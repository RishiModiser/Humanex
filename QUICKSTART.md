# HUMANEX BOT - Quick Start Guide

## ⚠️ Important: Use v5.0, Not v4.0!

If you're seeing an "old bot" when running `Humanex_v4.0.py`, that's because it's the **legacy v4.0 version**. 

**Follow this guide to run the NEW v5.0 web application!**

---

## 🚀 Quick Start (5 minutes)

### Prerequisites
- Node.js 16+ installed
- npm 8+ installed
- 4GB+ RAM
- Internet connection

### Installation Steps

**EASIEST METHOD - Use Startup Scripts:**

```bash
# For Linux/Mac:
./start.sh

# For Windows:
start.bat
```

The scripts will automatically:
- Check Node.js installation
- Install all dependencies
- Install Playwright browsers
- Start the application

**MANUAL METHOD:**

```bash
# 1. Navigate to project directory
cd Humanex

# 2. Install all dependencies (root + frontend)
npm install
cd frontend && npm install && cd ..

# 3. Install Playwright browser
npx playwright install chromium

# 4. Start development server
npm run dev
```

### Access the Application

- **Frontend UI**: http://localhost:5173
- **Backend API**: http://localhost:3000

### First Use

1. **Website Details Tab**
   - Add target URL (e.g., https://example.com)
   - Set stay time (e.g., 5000ms = 5 seconds)

2. **Traffic Settings Tab**
   - Set Total Profiles: 5
   - Set Concurrent Profiles: 2
   - Select Platform: Windows
   - Enable Human-like Scrolling

3. **Bot Control Tab**
   - Click "START BOT"
   - Watch real-time progress
   - View stats update live

4. **Logs Tab**
   - Monitor execution logs
   - See color-coded messages
   - Export logs if needed

### RPA Script Creator (Advanced)

1. Go to **RPA System** tab
2. Click action buttons to add steps
3. Configure each step
4. Reorder with up/down arrows
5. Export JSON script
6. Use in automation

### Common Issues

**Port already in use?**
```bash
# Change port in .env file
echo "PORT=3001" > .env
```

**Playwright not installed?**
```bash
npx playwright install chromium
```

**Dependencies error?**
```bash
rm -rf node_modules frontend/node_modules
npm install
cd frontend && npm install && cd ..
```

### Production Build

```bash
# Build frontend
npm run build

# Start production server
npm start
```

Application will be available at http://localhost:3000

### Need Help?

- Check README.md for full documentation
- See sample_scripts/ for RPA examples
- Contact: CODEWITHASAD

---

**Tip**: Start with small configurations (2-3 profiles) to test before scaling up!
