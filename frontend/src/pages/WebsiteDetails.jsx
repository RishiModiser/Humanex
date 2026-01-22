import React from 'react'
import { Plus, Trash2, Globe } from 'lucide-react'

const WebsiteDetails = ({ config, updateConfig }) => {
  const addURL = () => {
    const newUrls = [...config.urls, { url: '', stayTime: 5000 }]
    updateConfig({ urls: newUrls })
  }

  const removeURL = (index) => {
    const newUrls = config.urls.filter((_, i) => i !== index)
    updateConfig({ urls: newUrls })
  }

  const updateURL = (index, field, value) => {
    const newUrls = [...config.urls]
    newUrls[index][field] = value
    updateConfig({ urls: newUrls })
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center space-x-3">
            <Globe className="w-8 h-8 text-jarvis-accent" />
            <span>Website Details</span>
          </h2>
          <p className="text-gray-400 mt-2">Configure target websites and visit duration</p>
        </div>
        <button
          onClick={addURL}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add URL</span>
        </button>
      </div>

      <div className="grid gap-4">
        {config.urls.map((urlConfig, index) => (
          <div key={index} className="card">
            <div className="flex items-start space-x-4">
              <div className="flex-1 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Target Website URL
                  </label>
                  <input
                    type="url"
                    value={urlConfig.url}
                    onChange={(e) => updateURL(index, 'url', e.target.value)}
                    placeholder="https://example.com"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Stay Time (milliseconds)
                  </label>
                  <input
                    type="number"
                    value={urlConfig.stayTime}
                    onChange={(e) => updateURL(index, 'stayTime', parseInt(e.target.value) || 0)}
                    placeholder="5000"
                    className="input-field"
                    min="0"
                    step="1000"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Current: {(urlConfig.stayTime / 1000).toFixed(1)} seconds
                  </p>
                </div>
              </div>

              {config.urls.length > 1 && (
                <button
                  onClick={() => removeURL(index)}
                  className="btn-danger flex items-center space-x-2 mt-8"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Remove</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="card bg-jarvis-accent/5 border-jarvis-accent/30">
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 rounded-full bg-jarvis-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-jarvis-accent text-xs font-bold">i</span>
          </div>
          <div className="text-sm text-gray-300">
            <p className="font-semibold mb-1">Tips:</p>
            <ul className="space-y-1 text-gray-400">
              <li>• Add multiple URLs to create a browsing sequence</li>
              <li>• Stay time is in milliseconds (1000ms = 1 second)</li>
              <li>• URLs will be visited in the order listed</li>
              <li>• Combine with traffic settings for optimal results</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WebsiteDetails
