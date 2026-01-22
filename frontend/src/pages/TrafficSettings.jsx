import React from 'react'
import { Activity, Monitor, Smartphone, MousePointer, Eye, EyeOff } from 'lucide-react'

const TrafficSettings = ({ config, updateConfig }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-white flex items-center space-x-3">
          <Activity className="w-8 h-8 text-jarvis-accent" />
          <span>Traffic Settings</span>
        </h2>
        <p className="text-gray-400 mt-2">Configure bot behavior and traffic patterns</p>
      </div>

      {/* Profile Configuration */}
      <div className="card">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-jarvis-accent animate-pulse"></div>
          <span>Profile Configuration</span>
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Total Profiles
            </label>
            <input
              type="number"
              value={config.totalProfiles}
              onChange={(e) => updateConfig({ totalProfiles: parseInt(e.target.value) || 1 })}
              className="input-field"
              min="1"
            />
            <p className="text-xs text-gray-500 mt-1">Total number of browser profiles to execute</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Concurrent Profiles
            </label>
            <input
              type="number"
              value={config.concurrentProfiles}
              onChange={(e) => updateConfig({ concurrentProfiles: parseInt(e.target.value) || 1 })}
              className="input-field"
              min="1"
              max={config.totalProfiles}
            />
            <p className="text-xs text-gray-500 mt-1">Number of profiles running simultaneously</p>
          </div>
        </div>

        <div className="mt-4 p-3 bg-jarvis-accent/10 rounded-lg border border-jarvis-accent/30">
          <p className="text-sm text-gray-300">
            Estimated completion time: <span className="text-jarvis-accent font-bold">
              {Math.ceil(config.totalProfiles / config.concurrentProfiles)} batches
            </span>
          </p>
        </div>
      </div>

      {/* Platform Selection */}
      <div className="card">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-jarvis-accent animate-pulse"></div>
          <span>Platform Selection</span>
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <button
            onClick={() => updateConfig({ platform: 'Windows' })}
            className={`
              p-6 rounded-lg border-2 transition-all duration-300
              ${config.platform === 'Windows'
                ? 'border-jarvis-accent bg-jarvis-accent/10 neon-glow'
                : 'border-gray-600 hover:border-gray-500'
              }
            `}
          >
            <Monitor className="w-8 h-8 mx-auto mb-2 text-jarvis-accent" />
            <div className="text-center">
              <div className="font-bold text-white">Windows</div>
              <div className="text-xs text-gray-400 mt-1">Desktop Browser</div>
            </div>
          </button>

          <button
            onClick={() => updateConfig({ platform: 'Android' })}
            className={`
              p-6 rounded-lg border-2 transition-all duration-300
              ${config.platform === 'Android'
                ? 'border-jarvis-accent bg-jarvis-accent/10 neon-glow'
                : 'border-gray-600 hover:border-gray-500'
              }
            `}
          >
            <Smartphone className="w-8 h-8 mx-auto mb-2 text-jarvis-accent" />
            <div className="text-center">
              <div className="font-bold text-white">Android</div>
              <div className="text-xs text-gray-400 mt-1">Mobile Browser</div>
            </div>
          </button>
        </div>
      </div>

      {/* Visit Type */}
      <div className="card">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-jarvis-accent animate-pulse"></div>
          <span>Visit Type</span>
        </h3>
        
        <div className="grid md:grid-cols-3 gap-4">
          {['direct', 'referral', 'search'].map((type) => (
            <button
              key={type}
              onClick={() => updateConfig({ visitType: type })}
              className={`
                p-4 rounded-lg border-2 transition-all duration-300
                ${config.visitType === type
                  ? 'border-jarvis-accent bg-jarvis-accent/10'
                  : 'border-gray-600 hover:border-gray-500'
                }
              `}
            >
              <div className="text-center">
                <div className="font-bold text-white capitalize">{type}</div>
                <div className="text-xs text-gray-400 mt-1">
                  {type === 'direct' && 'Direct URL visit'}
                  {type === 'referral' && 'From referral source'}
                  {type === 'search' && 'Via search engine'}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Behavior Settings */}
      <div className="card">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-jarvis-accent animate-pulse"></div>
          <span>Behavior Settings</span>
        </h3>
        
        <div className="space-y-4">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={config.humanLikeScrolling}
              onChange={(e) => updateConfig({ humanLikeScrolling: e.target.checked })}
              className="w-5 h-5 rounded bg-jarvis-bg-secondary border-jarvis-accent/50 text-jarvis-accent focus:ring-jarvis-accent"
            />
            <div className="flex items-center space-x-2">
              <MousePointer className="w-5 h-5 text-jarvis-accent" />
              <span className="text-white font-medium">Human-like Scrolling</span>
            </div>
          </label>

          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={config.enableInteraction}
              onChange={(e) => updateConfig({ enableInteraction: e.target.checked })}
              className="w-5 h-5 rounded bg-jarvis-bg-secondary border-jarvis-accent/50 text-jarvis-accent focus:ring-jarvis-accent"
            />
            <div className="flex items-center space-x-2">
              <MousePointer className="w-5 h-5 text-jarvis-accent" />
              <span className="text-white font-medium">Enable Interaction</span>
            </div>
          </label>

          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={config.extraPages}
              onChange={(e) => updateConfig({ extraPages: e.target.checked })}
              className="w-5 h-5 rounded bg-jarvis-bg-secondary border-jarvis-accent/50 text-jarvis-accent focus:ring-jarvis-accent"
            />
            <div className="flex items-center space-x-2">
              <span className="text-white font-medium">Visit Extra Pages</span>
            </div>
          </label>

          {config.extraPages && (
            <div className="ml-8">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Maximum Pages
              </label>
              <input
                type="number"
                value={config.maxPages}
                onChange={(e) => updateConfig({ maxPages: parseInt(e.target.value) || 1 })}
                className="input-field max-w-xs"
                min="1"
                max="10"
              />
            </div>
          )}

          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={config.headless}
              onChange={(e) => updateConfig({ headless: e.target.checked })}
              className="w-5 h-5 rounded bg-jarvis-bg-secondary border-jarvis-accent/50 text-jarvis-accent focus:ring-jarvis-accent"
            />
            <div className="flex items-center space-x-2">
              {config.headless ? (
                <EyeOff className="w-5 h-5 text-jarvis-accent" />
              ) : (
                <Eye className="w-5 h-5 text-jarvis-accent" />
              )}
              <span className="text-white font-medium">Headless Mode</span>
            </div>
          </label>
        </div>
      </div>
    </div>
  )
}

export default TrafficSettings
