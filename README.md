# HUMANEX BOT v5.0 - Advanced RPA Automation System

<div align="center">

![HUMANEX BOT](https://img.shields.io/badge/HUMANEX-BOT%20v5.0-00e5ff?style=for-the-badge)
![License](https://img.shields.io/badge/License-Commercial-green?style=for-the-badge)
![Platform](https://img.shields.io/badge/Platform-Web%20%7C%20Desktop-blue?style=for-the-badge)

**A commercial-grade RPA automation system with JARVIS-inspired UI**

[Features](#features) • [Installation](#installation) • [Usage](#usage) • [API](#api) • [License](#license)

</div>

---

## 🌟 Features

### Core System
- **Modern Tech Stack**: React + Tailwind CSS frontend, Node.js + Express backend
- **Playwright Automation**: Powerful browser automation engine
- **JSON-Based RPA**: Flexible, reusable automation scripts
- **Real-time Monitoring**: WebSocket-powered live logs and status updates
- **Modular Architecture**: Clean, scalable, maintainable codebase

### UI/UX
- **JARVIS Theme**: Futuristic dark UI with AI command center aesthetics
- **Glassmorphism**: Modern glass-effect panels with backdrop blur
- **Neon Accents**: Cyan and electric blue highlights with glow effects
- **AI Core Visualization**: Animated central core with orbiting particles
- **Responsive Design**: Works perfectly on desktop and large screens

### Automation Features
- **Visual RPA Builder**: Drag-and-drop workflow creation
- **Human-like Behavior**: Random scrolling, mouse movements, and delays
- **Multiple Platforms**: Windows and Android browser emulation
- **Proxy Support**: HTTP, HTTPS, and SOCKS5 proxy rotation
- **Traffic Simulation**: Direct, referral, and search traffic patterns
- **Concurrent Execution**: Multiple profiles running simultaneously

### RPA Actions
- Navigate to URLs
- Wait/Sleep
- Human-like scrolling
- Click elements
- Input text
- Create/close pages
- Refresh page
- Go back
- Take screenshots
- Custom JavaScript execution

---

## 📋 Requirements

- **Node.js**: v16 or higher
- **npm**: v8 or higher
- **Operating System**: Windows, macOS, or Linux
- **RAM**: Minimum 4GB (8GB+ recommended for concurrent profiles)
- **Disk Space**: 500MB+ for dependencies

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/RishiModiser/Humanex.git
cd Humanex
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 3. Install Playwright Browsers

```bash
npx playwright install chromium
```

### 4. Environment Configuration (Optional)

Create a `.env` file in the root directory:

```env
PORT=3000
NODE_ENV=production
```

---

## 🎮 Usage

### Development Mode

Run both frontend and backend in development mode:

```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:3000`
- Frontend development server on `http://localhost:5173`

### Production Mode

Build and run in production:

```bash
# Build frontend
npm run build

# Start production server
npm start
```

Access the application at `http://localhost:3000`

---

## 📚 User Guide

### 1. Website Details

Configure target websites and visit duration:
- Add multiple URLs
- Set stay time for each URL (in milliseconds)
- URLs will be visited in sequential order

### 2. Traffic Settings

Configure bot behavior:
- **Total Profiles**: Number of browser sessions to execute
- **Concurrent Profiles**: How many run simultaneously
- **Platform**: Choose Windows (desktop) or Android (mobile)
- **Visit Type**: Direct, Referral, or Search traffic
- **Human-like Scrolling**: Enable natural scrolling behavior
- **Enable Interaction**: Random mouse movements
- **Headless Mode**: Run browsers invisibly

### 3. Proxy Settings

Configure proxy servers:
- Paste proxy list (one per line)
- Supported formats:
  - `http://username:password@host:port`
  - `https://host:port`
  - `socks5://username:password@host:port`
  - `host:port:username:password`
  - `host:port`
- Proxies rotate automatically per profile

### 4. RPA Script Creator

Build visual automation workflows:
- Click action buttons to add steps
- Configure each action
- Reorder steps with up/down buttons
- Delete unwanted steps
- Preview JSON in real-time
- Export/import scripts

### 5. Bot Control

Start and monitor bot execution:
- View real-time statistics
- Monitor progress bar
- Start/stop bot
- View current configuration

### 6. Logs

Monitor system activity:
- Real-time log streaming
- Color-coded messages
- Export logs to file
- View statistics (success/errors/warnings)

---

## 🎯 RPA Script Examples

### Basic Navigation

```json
{
  "actions": [
    {
      "id": "uuid-1",
      "type": "navigate",
      "config": {
        "url": "https://example.com",
        "waitUntil": "domcontentloaded"
      }
    },
    {
      "id": "uuid-2",
      "type": "wait",
      "config": {
        "duration": 3000
      }
    }
  ]
}
```

### Search Workflow

```json
{
  "actions": [
    {
      "id": "uuid-1",
      "type": "navigate",
      "config": {
        "url": "https://www.google.com",
        "waitUntil": "networkidle"
      }
    },
    {
      "id": "uuid-2",
      "type": "input",
      "config": {
        "selector": "input[name='q']",
        "text": "humanex automation",
        "typeDelay": 100
      }
    },
    {
      "id": "uuid-3",
      "type": "click",
      "config": {
        "selector": "input[name='btnK']"
      }
    },
    {
      "id": "uuid-4",
      "type": "wait",
      "config": {
        "duration": 5000
      }
    }
  ]
}
```

### Scroll and Interact

```json
{
  "actions": [
    {
      "id": "uuid-1",
      "type": "navigate",
      "config": {
        "url": "https://example.com",
        "waitUntil": "load"
      }
    },
    {
      "id": "uuid-2",
      "type": "scrollPage",
      "config": {
        "scrollType": "position",
        "position": "middle",
        "wheelDistance": [100, 150],
        "sleepTime": [200, 300]
      }
    },
    {
      "id": "uuid-3",
      "type": "wait",
      "config": {
        "duration": 2000
      }
    },
    {
      "id": "uuid-4",
      "type": "scrollPage",
      "config": {
        "scrollType": "position",
        "position": "bottom",
        "wheelDistance": [150, 200],
        "sleepTime": [300, 500]
      }
    }
  ]
}
```

---

## 🔌 API Reference

### Bot Control

#### Start Bot
```http
POST /api/bot/start
Content-Type: application/json

{
  "trafficSettings": {...},
  "websiteDetails": {...},
  "proxySettings": {...},
  "rpaScript": {...}
}
```

#### Stop Bot
```http
POST /api/bot/stop
```

#### Get Status
```http
GET /api/bot/status
```

### RPA Scripts

#### Execute Script
```http
POST /api/rpa/execute
Content-Type: application/json

{
  "script": {...},
  "config": {...}
}
```

#### Validate Script
```http
POST /api/rpa/validate
Content-Type: application/json

{
  "script": {...}
}
```

#### Get Templates
```http
GET /api/rpa/templates
```

### Proxy Management

#### Upload Proxies
```http
POST /api/proxy/upload
Content-Type: application/json

{
  "proxies": ["proxy1", "proxy2", ...]
}
```

#### List Proxies
```http
GET /api/proxy/list
```

---

## 🏗️ Project Structure

```
Humanex/
├── backend/
│   ├── controllers/
│   │   ├── botController.js
│   │   ├── rpaController.js
│   │   └── proxyController.js
│   ├── services/
│   │   ├── automationEngine.js
│   │   ├── rpaExecutor.js
│   │   └── configManager.js
│   ├── utils/
│   │   └── helpers.js
│   ├── logs/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Header.jsx
│   │   │   └── AICore.jsx
│   │   ├── pages/
│   │   │   ├── WebsiteDetails.jsx
│   │   │   ├── TrafficSettings.jsx
│   │   │   ├── ProxySettings.jsx
│   │   │   ├── RPASystem.jsx
│   │   │   ├── BotControl.jsx
│   │   │   └── Logs.jsx
│   │   ├── styles/
│   │   │   └── index.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── Humanex_v4.0.py (Legacy - License Preserved)
├── package.json
├── .gitignore
└── README.md
```

---

## 🔒 Security Features

- **Stealth Mode**: Anti-detection measures to avoid bot detection
- **Fingerprint Randomization**: Unique browser fingerprints per profile
- **Proxy Rotation**: Automatic IP rotation for anonymity
- **Error Handling**: Graceful error recovery with screenshots
- **License Protection**: Original license module preserved and intact

---

## 🎨 UI Screenshots

The application features a futuristic JARVIS-inspired interface with:
- Dark theme with gradient backgrounds
- Glassmorphism effects on panels
- Neon cyan and electric blue accents
- Animated AI core visualization
- Smooth transitions and hover effects
- Responsive sidebar navigation

---

## 🤝 Support

For support, contact:
- **Website**: [adsenseloadingmethod.com](https://adsenseloadingmethod.com)
- **Developer**: [asadwebdev.com](https://asadwebdev.com)
- **Phone**: +44 7776517786
- **Developer**: CODEWITHASAD

---

## ⚠️ Disclaimer

This tool is designed for educational and testing purposes only. Unauthorized misuse of traffic simulation or automation can lead to legal consequences. Use responsibly and ensure compliance with all applicable laws and terms of service.

---

## 📄 License

© 2026 HUMANEX BOT. All rights reserved.

Commercial license required for production use. The original license key activation system is preserved and fully functional.

---

## 🚀 Roadmap

- [ ] Machine learning-based CAPTCHA solving
- [ ] Advanced fingerprinting techniques
- [ ] Cloud-based execution
- [ ] Multi-language support
- [ ] Pre-built automation templates
- [ ] Analytics dashboard
- [ ] Scheduling and cron jobs

---

<div align="center">

**Built with ❤️ by CODEWITHASAD**

[![GitHub](https://img.shields.io/badge/GitHub-RishiModiser-181717?style=for-the-badge&logo=github)](https://github.com/RishiModiser)

</div>
