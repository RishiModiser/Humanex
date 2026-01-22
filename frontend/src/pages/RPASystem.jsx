import React, { useState } from 'react'
import { FileCode, Plus, Trash2, ChevronUp, ChevronDown, Play, Eye, Download, Upload } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'

const RPASystem = ({ config, updateConfig }) => {
  const [script, setScript] = useState(config.rpaScript || { actions: [] })
  const [showJsonPreview, setShowJsonPreview] = useState(false)
  const [selectedAction, setSelectedAction] = useState(null)

  const actionTypes = [
    { type: 'navigate', label: 'Navigate', icon: '🌐', desc: 'Go to URL' },
    { type: 'wait', label: 'Wait', icon: '⏳', desc: 'Pause execution' },
    { type: 'scrollPage', label: 'Scroll', icon: '📜', desc: 'Scroll page' },
    { type: 'click', label: 'Click', icon: '👆', desc: 'Click element' },
    { type: 'input', label: 'Input', icon: '⌨️', desc: 'Type text' },
    { type: 'newPage', label: 'New Page', icon: '📄', desc: 'Open new tab' },
    { type: 'refresh', label: 'Refresh', icon: '🔄', desc: 'Reload page' },
    { type: 'goBack', label: 'Go Back', icon: '⬅️', desc: 'Navigate back' },
    { type: 'closeOtherPages', label: 'Close Others', icon: '❌', desc: 'Close other tabs' },
    { type: 'screenshot', label: 'Screenshot', icon: '📸', desc: 'Capture screen' },
  ]

  const addAction = (type) => {
    const newAction = {
      id: uuidv4(),
      type,
      config: getDefaultConfig(type)
    }
    
    const newScript = {
      ...script,
      actions: [...script.actions, newAction]
    }
    
    setScript(newScript)
    updateConfig({ ...config, rpaScript: newScript })
  }

  const removeAction = (index) => {
    const newScript = {
      ...script,
      actions: script.actions.filter((_, i) => i !== index)
    }
    
    setScript(newScript)
    updateConfig({ ...config, rpaScript: newScript })
  }

  const moveAction = (index, direction) => {
    const newActions = [...script.actions]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    
    if (targetIndex < 0 || targetIndex >= newActions.length) return
    
    [newActions[index], newActions[targetIndex]] = [newActions[targetIndex], newActions[index]]
    
    const newScript = { ...script, actions: newActions }
    setScript(newScript)
    updateConfig({ ...config, rpaScript: newScript })
  }

  const updateAction = (index, newConfig) => {
    const newActions = [...script.actions]
    newActions[index].config = { ...newActions[index].config, ...newConfig }
    
    const newScript = { ...script, actions: newActions }
    setScript(newScript)
    updateConfig({ ...config, rpaScript: newScript })
  }

  const getDefaultConfig = (type) => {
    switch (type) {
      case 'navigate':
        return { url: 'https://example.com', waitUntil: 'domcontentloaded' }
      case 'wait':
        return { duration: 3000 }
      case 'scrollPage':
        return {
          scrollType: 'position',
          position: 'middle',
          wheelDistance: [100, 150],
          sleepTime: [200, 300]
        }
      case 'click':
        return { selector: '', button: 'left', delay: 100 }
      case 'input':
        return { selector: '', text: '', typeDelay: 100, clear: true }
      case 'screenshot':
        return { path: `./screenshot_${Date.now()}.png`, fullPage: false }
      default:
        return {}
    }
  }

  const exportScript = () => {
    const dataStr = JSON.stringify(script, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)
    const exportFileDefaultName = `rpa_script_${Date.now()}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const importScript = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target.result)
          setScript(imported)
          updateConfig({ ...config, rpaScript: imported })
        } catch (error) {
          alert('Invalid JSON file')
        }
      }
      reader.readAsText(file)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center space-x-3">
            <FileCode className="w-8 h-8 text-jarvis-accent" />
            <span>RPA Script Creator</span>
          </h2>
          <p className="text-gray-400 mt-2">Build visual automation workflows</p>
        </div>

        <div className="flex items-center space-x-3">
          <label className="btn-secondary flex items-center space-x-2 cursor-pointer">
            <Upload className="w-5 h-5" />
            <span>Import</span>
            <input
              type="file"
              accept=".json"
              onChange={importScript}
              className="hidden"
            />
          </label>
          
          <button
            onClick={exportScript}
            className="btn-secondary flex items-center space-x-2"
            disabled={script.actions.length === 0}
          >
            <Download className="w-5 h-5" />
            <span>Export</span>
          </button>

          <button
            onClick={() => setShowJsonPreview(!showJsonPreview)}
            className="btn-secondary flex items-center space-x-2"
          >
            <Eye className="w-5 h-5" />
            <span>{showJsonPreview ? 'Hide' : 'Show'} JSON</span>
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="card">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
          <Plus className="w-5 h-5 text-jarvis-accent" />
          <span>Add Action</span>
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {actionTypes.map((action) => (
            <button
              key={action.type}
              onClick={() => addAction(action.type)}
              className="p-4 rounded-lg border-2 border-jarvis-accent/30 hover:border-jarvis-accent hover:bg-jarvis-accent/10 transition-all duration-300 group"
            >
              <div className="text-2xl mb-2">{action.icon}</div>
              <div className="text-sm font-bold text-white group-hover:text-jarvis-accent">
                {action.label}
              </div>
              <div className="text-xs text-gray-500 mt-1">{action.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Script Steps */}
      <div className="card">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
          <Play className="w-5 h-5 text-jarvis-accent" />
          <span>Workflow Steps ({script.actions.length})</span>
        </h3>

        {script.actions.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <FileCode className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>No actions added yet. Click an action button above to start building your workflow.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {script.actions.map((action, index) => (
              <div
                key={action.id}
                className="glass-strong p-4 rounded-lg hover:border-jarvis-accent/50 transition-all"
              >
                <div className="flex items-start space-x-4">
                  {/* Step Number */}
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-jarvis-accent/20 flex items-center justify-center text-jarvis-accent font-bold">
                    {index + 1}
                  </div>

                  {/* Action Details */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="text-xl">
                        {actionTypes.find(a => a.type === action.type)?.icon}
                      </span>
                      <span className="font-bold text-white">
                        {actionTypes.find(a => a.type === action.type)?.label}
                      </span>
                    </div>

                    {/* Action Configuration */}
                    <ActionConfig
                      action={action}
                      onUpdate={(newConfig) => updateAction(index, newConfig)}
                    />
                  </div>

                  {/* Controls */}
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={() => moveAction(index, 'up')}
                      disabled={index === 0}
                      className="p-2 rounded bg-jarvis-accent/20 hover:bg-jarvis-accent/30 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronUp className="w-4 h-4 text-jarvis-accent" />
                    </button>
                    
                    <button
                      onClick={() => moveAction(index, 'down')}
                      disabled={index === script.actions.length - 1}
                      className="p-2 rounded bg-jarvis-accent/20 hover:bg-jarvis-accent/30 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronDown className="w-4 h-4 text-jarvis-accent" />
                    </button>
                    
                    <button
                      onClick={() => removeAction(index)}
                      className="p-2 rounded bg-red-500/20 hover:bg-red-500/30"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* JSON Preview */}
      {showJsonPreview && (
        <div className="card">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
            <Eye className="w-5 h-5 text-jarvis-accent" />
            <span>JSON Preview</span>
          </h3>
          
          <pre className="bg-jarvis-bg p-4 rounded-lg overflow-x-auto text-sm text-jarvis-accent font-mono border border-jarvis-accent/30">
            {JSON.stringify(script, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}

// Action Configuration Component
const ActionConfig = ({ action, onUpdate }) => {
  const { type, config } = action

  switch (type) {
    case 'navigate':
      return (
        <div className="space-y-2">
          <input
            type="url"
            value={config.url || ''}
            onChange={(e) => onUpdate({ url: e.target.value })}
            placeholder="https://example.com"
            className="input-field text-sm"
          />
        </div>
      )

    case 'wait':
      return (
        <div className="space-y-2">
          <input
            type="number"
            value={config.duration || 0}
            onChange={(e) => onUpdate({ duration: parseInt(e.target.value) || 0 })}
            placeholder="Duration (ms)"
            className="input-field text-sm"
          />
          <span className="text-xs text-gray-400">Wait {(config.duration / 1000).toFixed(1)}s</span>
        </div>
      )

    case 'scrollPage':
      return (
        <div className="space-y-2">
          <select
            value={config.position || 'middle'}
            onChange={(e) => onUpdate({ position: e.target.value })}
            className="input-field text-sm"
          >
            <option value="top">Scroll to Top</option>
            <option value="middle">Scroll to Middle</option>
            <option value="bottom">Scroll to Bottom</option>
          </select>
        </div>
      )

    case 'click':
      return (
        <div className="space-y-2">
          <input
            type="text"
            value={config.selector || ''}
            onChange={(e) => onUpdate({ selector: e.target.value })}
            placeholder="CSS Selector (e.g., .button-class)"
            className="input-field text-sm"
          />
        </div>
      )

    case 'input':
      return (
        <div className="space-y-2">
          <input
            type="text"
            value={config.selector || ''}
            onChange={(e) => onUpdate({ selector: e.target.value })}
            placeholder="CSS Selector"
            className="input-field text-sm"
          />
          <input
            type="text"
            value={config.text || ''}
            onChange={(e) => onUpdate({ text: e.target.value })}
            placeholder="Text to type"
            className="input-field text-sm"
          />
        </div>
      )

    default:
      return (
        <div className="text-sm text-gray-400">
          No configuration needed
        </div>
      )
  }
}

export default RPASystem
