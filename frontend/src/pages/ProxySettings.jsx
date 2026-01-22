import React, { useState } from 'react'
import { Shield, Upload, CheckCircle, XCircle, Loader } from 'lucide-react'
import axios from 'axios'

const ProxySettings = ({ config, updateConfig }) => {
  const [proxyText, setProxyText] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState(null)

  const handleUpload = async () => {
    if (!proxyText.trim()) {
      setUploadStatus({ type: 'error', message: 'Please enter proxies' })
      return
    }

    setLoading(true)
    setUploadStatus(null)

    try {
      const proxies = proxyText.split('\n').filter(line => line.trim())
      
      const response = await axios.post('/api/proxy/upload', { proxies })
      
      updateConfig({
        enabled: true,
        proxies: response.data.proxies
      })

      setUploadStatus({
        type: 'success',
        message: `✅ Loaded ${response.data.loaded} proxies successfully`
      })
    } catch (error) {
      setUploadStatus({
        type: 'error',
        message: `❌ Failed to upload proxies: ${error.response?.data?.message || error.message}`
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-white flex items-center space-x-3">
          <Shield className="w-8 h-8 text-jarvis-accent" />
          <span>Proxy Settings</span>
        </h2>
        <p className="text-gray-400 mt-2">Configure proxy servers for bot traffic</p>
      </div>

      {/* Enable Proxy */}
      <div className="card">
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={config.enabled}
            onChange={(e) => updateConfig({ enabled: e.target.checked })}
            className="w-5 h-5 rounded bg-jarvis-bg-secondary border-jarvis-accent/50 text-jarvis-accent focus:ring-jarvis-accent"
          />
          <div>
            <span className="text-white font-medium text-lg">Enable Proxy</span>
            <p className="text-xs text-gray-400 mt-1">Route traffic through proxy servers</p>
          </div>
        </label>
      </div>

      {/* Proxy Input */}
      <div className="card">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-jarvis-accent animate-pulse"></div>
          <span>Proxy List</span>
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Enter Proxies (one per line)
            </label>
            <textarea
              value={proxyText}
              onChange={(e) => setProxyText(e.target.value)}
              placeholder={`http://username:password@host:port
https://host:port
socks5://username:password@host:port
host:port:username:password
host:port`}
              className="input-field font-mono text-sm"
              rows="10"
            />
          </div>

          <button
            onClick={handleUpload}
            disabled={loading}
            className="btn-primary flex items-center space-x-2"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                <span>Upload Proxies</span>
              </>
            )}
          </button>

          {uploadStatus && (
            <div className={`
              p-4 rounded-lg border-2 flex items-center space-x-3
              ${uploadStatus.type === 'success'
                ? 'border-green-500 bg-green-500/10'
                : 'border-red-500 bg-red-500/10'
              }
            `}>
              {uploadStatus.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
              <span className="text-white">{uploadStatus.message}</span>
            </div>
          )}
        </div>
      </div>

      {/* Current Proxies */}
      {config.proxies && config.proxies.length > 0 && (
        <div className="card">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span>Loaded Proxies ({config.proxies.length})</span>
          </h3>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {config.proxies.slice(0, 10).map((proxy, index) => (
              <div key={index} className="p-3 bg-jarvis-bg-secondary/50 rounded-lg border border-jarvis-accent/20">
                <div className="flex items-center justify-between">
                  <code className="text-sm text-jarvis-accent">
                    {proxy.host}:{proxy.port}
                  </code>
                  <span className="text-xs text-gray-400">
                    {proxy.protocol.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
            {config.proxies.length > 10 && (
              <div className="text-center text-gray-400 text-sm py-2">
                ... and {config.proxies.length - 10} more
              </div>
            )}
          </div>
        </div>
      )}

      {/* Proxy Formats Info */}
      <div className="card bg-jarvis-accent/5 border-jarvis-accent/30">
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 rounded-full bg-jarvis-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-jarvis-accent text-xs font-bold">i</span>
          </div>
          <div className="text-sm text-gray-300">
            <p className="font-semibold mb-2">Supported Proxy Formats:</p>
            <ul className="space-y-1 text-gray-400 font-mono text-xs">
              <li>• http://username:password@host:port</li>
              <li>• https://host:port</li>
              <li>• socks5://username:password@host:port</li>
              <li>• host:port:username:password</li>
              <li>• host:port</li>
            </ul>
            <p className="mt-3 text-gray-400">
              Proxies will be automatically rotated for each profile execution.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProxySettings
