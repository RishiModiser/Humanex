import React from 'react'
import { Bot, Cpu } from 'lucide-react'

const Header = () => {
  const [currentTime, setCurrentTime] = React.useState(new Date())

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <header className="glass border-b border-jarvis-accent/20 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-jarvis-accent to-jarvis-blue flex items-center justify-center neon-glow">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">HUMANEX BOT</h2>
            <p className="text-xs text-gray-400">Advanced RPA Automation Platform</p>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 text-jarvis-accent">
            <Cpu className="w-5 h-5 animate-pulse-slow" />
            <span className="text-sm font-mono">SYSTEM ONLINE</span>
          </div>
          
          <div className="text-right">
            <div className="text-sm font-mono text-gray-300">
              {currentTime.toLocaleTimeString()}
            </div>
            <div className="text-xs text-gray-500">
              {currentTime.toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
