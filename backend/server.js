// HUMANEX BOT - Backend Server
// Main Express server with WebSocket support for real-time logging

const express = require('express');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
require('dotenv').config();

const botController = require('./controllers/botController');
const rpaController = require('./controllers/rpaController');
const proxyController = require('./controllers/proxyController');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from frontend build
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// WebSocket connections for real-time logs
const wsClients = new Set();

wss.on('connection', (ws) => {
  console.log('✅ Client connected to WebSocket');
  wsClients.add(ws);
  
  ws.on('close', () => {
    console.log('❌ Client disconnected from WebSocket');
    wsClients.delete(ws);
  });
});

// Broadcast logs to all connected clients
global.broadcastLog = (message) => {
  const timestamp = new Date().toISOString();
  const logMessage = JSON.stringify({
    type: 'log',
    timestamp,
    message
  });
  
  wsClients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(logMessage);
    }
  });
  
  console.log(`[${timestamp}] ${message}`);
};

// Broadcast status updates
global.broadcastStatus = (data) => {
  const statusMessage = JSON.stringify({
    type: 'status',
    ...data
  });
  
  wsClients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(statusMessage);
    }
  });
};

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', version: '5.0.0' });
});

// Bot control routes
app.post('/api/bot/start', botController.startBot);
app.post('/api/bot/stop', botController.stopBot);
app.get('/api/bot/status', botController.getStatus);

// RPA script routes
app.post('/api/rpa/execute', rpaController.executeScript);
app.post('/api/rpa/validate', rpaController.validateScript);
app.get('/api/rpa/templates', rpaController.getTemplates);

// Proxy routes
app.post('/api/proxy/upload', proxyController.uploadProxies);
app.get('/api/proxy/list', proxyController.listProxies);
app.post('/api/proxy/validate', proxyController.validateProxy);

// Serve frontend for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║          HUMANEX BOT v5.0 - Server Started            ║');
  console.log('╠════════════════════════════════════════════════════════╣');
  console.log(`║  🚀 Server running on: http://localhost:${PORT}         ║`);
  console.log(`║  🌐 WebSocket available for real-time logs             ║`);
  console.log(`║  🤖 RPA Automation Engine: Ready                       ║`);
  console.log('╚════════════════════════════════════════════════════════╝');
});

module.exports = { app, server, wss };
