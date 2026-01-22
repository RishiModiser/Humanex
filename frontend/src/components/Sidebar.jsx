import React from 'react'
import { Activity, Globe, Settings, Zap, Terminal, FileCode, Shield } from 'lucide-react'

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'website', label: 'Website Details', icon: Globe },
    { id: 'traffic', label: 'Traffic Settings', icon: Activity },
    { id: 'proxy', label: 'Proxy Settings', icon: Shield },
    { id: 'rpa', label: 'RPA System', icon: FileCode },
    { id: 'control', label: 'Bot Control', icon: Zap },
    { id: 'logs', label: 'Logs / Status', icon: Terminal },
  ]

  return (
    <aside className="w-64 glass-strong border-r border-jarvis-accent/20">
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold neon-text">HUMANEX</h1>
          <p className="text-xs text-gray-400 mt-1">RPA Automation System v5.0</p>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3 rounded-lg
                  transition-all duration-300
                  ${isActive
                    ? 'bg-jarvis-accent/20 border border-jarvis-accent/50 neon-glow text-jarvis-accent'
                    : 'hover:bg-jarvis-accent/10 border border-transparent text-gray-400 hover:text-gray-200'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-jarvis-accent/20">
        <div className="text-xs text-gray-500 text-center">
          <p>Built by <span className="text-jarvis-accent">CODEWITHASAD</span></p>
          <p className="mt-1">© 2026 HUMANEX</p>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
