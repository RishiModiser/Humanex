import React, { useEffect, useRef } from 'react'
import { Terminal, Download, Trash2 } from 'lucide-react'

const Logs = ({ logs }) => {
  const logContainerRef = useRef(null)

  useEffect(() => {
    // Auto-scroll to bottom when new logs arrive
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight
    }
  }, [logs])

  const exportLogs = () => {
    const logText = logs.map(log => `[${log.timestamp}] ${log.message}`).join('\n')
    const dataUri = 'data:text/plain;charset=utf-8,' + encodeURIComponent(logText)
    const exportFileDefaultName = `humanex_logs_${Date.now()}.txt`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const clearLogs = () => {
    if (window.confirm('Are you sure you want to clear all logs?')) {
      // This would need to be handled at the App level
      // For now, just show message
      alert('Clear logs functionality - implement at app level')
    }
  }

  const getLogColor = (message) => {
    if (message.includes('✅') || message.includes('success')) return 'text-green-400'
    if (message.includes('❌') || message.includes('error') || message.includes('failed')) return 'text-red-400'
    if (message.includes('⚠️') || message.includes('warning')) return 'text-yellow-400'
    if (message.includes('🚀') || message.includes('start')) return 'text-jarvis-accent'
    if (message.includes('🛑') || message.includes('stop')) return 'text-orange-400'
    return 'text-gray-300'
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center space-x-3">
            <Terminal className="w-8 h-8 text-jarvis-accent" />
            <span>System Logs</span>
          </h2>
          <p className="text-gray-400 mt-2">Real-time bot execution logs and status updates</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={exportLogs}
            className="btn-secondary flex items-center space-x-2"
            disabled={logs.length === 0}
          >
            <Download className="w-5 h-5" />
            <span>Export</span>
          </button>

          <button
            onClick={clearLogs}
            className="btn-danger flex items-center space-x-2"
            disabled={logs.length === 0}
          >
            <Trash2 className="w-5 h-5" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Log Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="card">
          <div className="text-gray-400 text-sm mb-1">Total Entries</div>
          <div className="text-2xl font-bold text-white">{logs.length}</div>
        </div>

        <div className="card">
          <div className="text-gray-400 text-sm mb-1">Success</div>
          <div className="text-2xl font-bold text-green-500">
            {logs.filter(l => l.message.includes('✅')).length}
          </div>
        </div>

        <div className="card">
          <div className="text-gray-400 text-sm mb-1">Errors</div>
          <div className="text-2xl font-bold text-red-500">
            {logs.filter(l => l.message.includes('❌')).length}
          </div>
        </div>

        <div className="card">
          <div className="text-gray-400 text-sm mb-1">Warnings</div>
          <div className="text-2xl font-bold text-yellow-500">
            {logs.filter(l => l.message.includes('⚠️')).length}
          </div>
        </div>
      </div>

      {/* Log Console */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span>Live Console</span>
          </h3>
          
          <div className="text-sm text-gray-400">
            {logs.length > 0 && `Last update: ${logs[logs.length - 1]?.timestamp}`}
          </div>
        </div>

        <div
          ref={logContainerRef}
          className="bg-jarvis-bg rounded-lg p-4 h-[500px] overflow-y-auto border border-jarvis-accent/30 font-mono text-sm"
        >
          {logs.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <Terminal className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No logs yet. Start the bot to see live logs.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              {logs.map((log, index) => (
                <div key={index} className="flex items-start space-x-3 hover:bg-jarvis-accent/5 p-1 rounded">
                  <span className="text-gray-500 text-xs flex-shrink-0 mt-0.5">
                    {log.timestamp}
                  </span>
                  <span className={`flex-1 ${getLogColor(log.message)}`}>
                    {log.message}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-4 p-3 bg-jarvis-accent/5 rounded-lg border border-jarvis-accent/20 text-sm text-gray-400">
          <p>💡 <strong>Tip:</strong> Logs are updated in real-time via WebSocket connection. Export logs before clearing for record keeping.</p>
        </div>
      </div>
    </div>
  )
}

export default Logs
