import React, { useState } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import AICore from './components/AICore'
import WebsiteDetails from './pages/WebsiteDetails'
import TrafficSettings from './pages/TrafficSettings'
import ProxySettings from './pages/ProxySettings'
import RPASystem from './pages/RPASystem'
import BotControl from './pages/BotControl'
import Logs from './pages/Logs'

function App() {
  const [activeTab, setActiveTab] = useState('website')
  const [logs, setLogs] = useState([])
  const [botStatus, setBotStatus] = useState({
    isRunning: false,
    completedProfiles: 0,
    remainingProfiles: 0,
    activeProfiles: 0
  })

  const [config, setConfig] = useState({
    websiteDetails: {
      urls: [{ url: '', stayTime: 5000 }]
    },
    trafficSettings: {
      totalProfiles: 10,
      concurrentProfiles: 2,
      platform: 'Windows',
      visitType: 'direct',
      humanLikeScrolling: true,
      enableInteraction: true,
      headless: false,
      extraPages: false,
      maxPages: 3
    },
    proxySettings: {
      enabled: false,
      proxies: []
    },
    rpaScript: null
  })

  // WebSocket connection for real-time logs
  React.useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const wsUrl = `${protocol}//${window.location.hostname}:3000`
    
    let ws
    
    try {
      ws = new WebSocket(wsUrl)
      
      ws.onopen = () => {
        addLog('✅ Connected to bot server')
      }
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          
          if (data.type === 'log') {
            addLog(data.message)
          } else if (data.type === 'status') {
            setBotStatus(prev => ({ ...prev, ...data }))
          }
        } catch (error) {
          console.error('WebSocket message error:', error)
        }
      }
      
      ws.onerror = (error) => {
        console.error('WebSocket error:', error)
        addLog('❌ WebSocket connection error')
      }
      
      ws.onclose = () => {
        addLog('⚠️ Disconnected from server')
      }
    } catch (error) {
      console.error('WebSocket connection failed:', error)
    }
    
    return () => {
      if (ws) {
        ws.close()
      }
    }
  }, [])

  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => [...prev, { timestamp, message }].slice(-100))
  }

  const updateConfig = (section, data) => {
    setConfig(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data }
    }))
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'website':
        return <WebsiteDetails config={config.websiteDetails} updateConfig={(data) => updateConfig('websiteDetails', data)} />
      case 'traffic':
        return <TrafficSettings config={config.trafficSettings} updateConfig={(data) => updateConfig('trafficSettings', data)} />
      case 'proxy':
        return <ProxySettings config={config.proxySettings} updateConfig={(data) => updateConfig('proxySettings', data)} />
      case 'rpa':
        return <RPASystem config={config} updateConfig={setConfig} />
      case 'control':
        return <BotControl config={config} botStatus={botStatus} setBotStatus={setBotStatus} addLog={addLog} />
      case 'logs':
        return <Logs logs={logs} />
      default:
        return <WebsiteDetails config={config.websiteDetails} updateConfig={(data) => updateConfig('websiteDetails', data)} />
    }
  }

  return (
    <Router>
      <div className="min-h-screen bg-jarvis-bg relative overflow-hidden">
        {/* Animated background particles */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-jarvis-accent rounded-full opacity-50 particle"></div>
          <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-jarvis-neon rounded-full opacity-40 particle" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-jarvis-blue rounded-full opacity-30 particle" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-2/3 right-1/3 w-1 h-1 bg-jarvis-accent rounded-full opacity-50 particle" style={{animationDelay: '3s'}}></div>
        </div>

        <div className="flex h-screen">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            
            <main className="flex-1 overflow-y-auto p-6">
              <div className="max-w-7xl mx-auto">
                {renderContent()}
              </div>
            </main>

            {/* AI Core Visualization - Fixed position */}
            <div className="fixed bottom-8 right-8 pointer-events-none">
              <AICore isActive={botStatus.isRunning} />
            </div>
          </div>
        </div>
      </div>
    </Router>
  )
}

export default App
