import React, { useState } from 'react'
import { Play, Square, Activity, Clock, CheckCircle, Loader } from 'lucide-react'
import axios from 'axios'

const BotControl = ({ config, botStatus, setBotStatus, addLog }) => {
  const [starting, setStarting] = useState(false)
  const [stopping, setStopping] = useState(false)

  const startBot = async () => {
    setStarting(true)
    addLog('🚀 Starting bot...')

    try {
      const response = await axios.post('/api/bot/start', config)
      
      setBotStatus({
        isRunning: true,
        ...response.data.stats
      })
      
      addLog('✅ Bot started successfully')
    } catch (error) {
      addLog(`❌ Failed to start bot: ${error.response?.data?.message || error.message}`)
    } finally {
      setStarting(false)
    }
  }

  const stopBot = async () => {
    setStopping(true)
    addLog('🛑 Stopping bot...')

    try {
      await axios.post('/api/bot/stop')
      
      setBotStatus({
        ...botStatus,
        isRunning: false
      })
      
      addLog('✅ Bot stopped successfully')
    } catch (error) {
      addLog(`❌ Failed to stop bot: ${error.response?.data?.message || error.message}`)
    } finally {
      setStopping(false)
    }
  }

  const formatTime = (ms) => {
    if (!ms) return '0s'
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`
    } else {
      return `${seconds}s`
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-white flex items-center space-x-3">
          <Activity className="w-8 h-8 text-jarvis-accent" />
          <span>Bot Control Panel</span>
        </h2>
        <p className="text-gray-400 mt-2">Start, stop, and monitor bot execution</p>
      </div>

      {/* Status Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Status</span>
            <div className={`w-3 h-3 rounded-full ${botStatus.isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></div>
          </div>
          <div className="text-2xl font-bold text-white">
            {botStatus.isRunning ? 'Running' : 'Idle'}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Completed</span>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-jarvis-accent">
            {botStatus.completedProfiles || 0}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Active</span>
            <Loader className={`w-5 h-5 text-jarvis-accent ${botStatus.isRunning ? 'animate-spin' : ''}`} />
          </div>
          <div className="text-2xl font-bold text-jarvis-blue">
            {botStatus.activeProfiles || 0}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Remaining</span>
            <Clock className="w-5 h-5 text-yellow-500" />
          </div>
          <div className="text-2xl font-bold text-yellow-500">
            {botStatus.remainingProfiles || 0}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {botStatus.totalProfiles > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-300 font-medium">Overall Progress</span>
            <span className="text-jarvis-accent font-bold">
              {Math.round((botStatus.completedProfiles / botStatus.totalProfiles) * 100)}%
            </span>
          </div>
          
          <div className="w-full h-4 bg-jarvis-bg-secondary rounded-full overflow-hidden border border-jarvis-accent/30">
            <div
              className="h-full bg-gradient-to-r from-jarvis-accent to-jarvis-blue transition-all duration-500 neon-glow"
              style={{
                width: `${(botStatus.completedProfiles / botStatus.totalProfiles) * 100}%`
              }}
            ></div>
          </div>

          <div className="mt-2 text-sm text-gray-400">
            {botStatus.completedProfiles} of {botStatus.totalProfiles} profiles completed
          </div>
        </div>
      )}

      {/* Control Buttons */}
      <div className="card">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-jarvis-accent animate-pulse"></div>
          <span>Controls</span>
        </h3>

        <div className="flex items-center space-x-4">
          {!botStatus.isRunning ? (
            <button
              onClick={startBot}
              disabled={starting}
              className="btn-primary flex items-center space-x-2 text-lg px-8 py-4"
            >
              {starting ? (
                <>
                  <Loader className="w-6 h-6 animate-spin" />
                  <span>Starting...</span>
                </>
              ) : (
                <>
                  <Play className="w-6 h-6" />
                  <span>START BOT</span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={stopBot}
              disabled={stopping}
              className="btn-danger flex items-center space-x-2 text-lg px-8 py-4"
            >
              {stopping ? (
                <>
                  <Loader className="w-6 h-6 animate-spin" />
                  <span>Stopping...</span>
                </>
              ) : (
                <>
                  <Square className="w-6 h-6" />
                  <span>STOP BOT</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Configuration Summary */}
      <div className="card">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-jarvis-accent animate-pulse"></div>
          <span>Current Configuration</span>
        </h3>

        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex justify-between py-2 border-b border-jarvis-accent/20">
              <span className="text-gray-400">Total Profiles:</span>
              <span className="text-white font-bold">{config.trafficSettings.totalProfiles}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-jarvis-accent/20">
              <span className="text-gray-400">Concurrent:</span>
              <span className="text-white font-bold">{config.trafficSettings.concurrentProfiles}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-jarvis-accent/20">
              <span className="text-gray-400">Platform:</span>
              <span className="text-white font-bold">{config.trafficSettings.platform}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-jarvis-accent/20">
              <span className="text-gray-400">Visit Type:</span>
              <span className="text-white font-bold capitalize">{config.trafficSettings.visitType}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between py-2 border-b border-jarvis-accent/20">
              <span className="text-gray-400">Human Scrolling:</span>
              <span className={`font-bold ${config.trafficSettings.humanLikeScrolling ? 'text-green-500' : 'text-red-500'}`}>
                {config.trafficSettings.humanLikeScrolling ? '✓ Enabled' : '✗ Disabled'}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-jarvis-accent/20">
              <span className="text-gray-400">Interactions:</span>
              <span className={`font-bold ${config.trafficSettings.enableInteraction ? 'text-green-500' : 'text-red-500'}`}>
                {config.trafficSettings.enableInteraction ? '✓ Enabled' : '✗ Disabled'}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-jarvis-accent/20">
              <span className="text-gray-400">Headless Mode:</span>
              <span className={`font-bold ${config.trafficSettings.headless ? 'text-green-500' : 'text-red-500'}`}>
                {config.trafficSettings.headless ? '✓ Enabled' : '✗ Disabled'}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-jarvis-accent/20">
              <span className="text-gray-400">Proxy:</span>
              <span className={`font-bold ${config.proxySettings.enabled ? 'text-green-500' : 'text-red-500'}`}>
                {config.proxySettings.enabled ? `✓ ${config.proxySettings.proxies?.length || 0} loaded` : '✗ Disabled'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BotControl
