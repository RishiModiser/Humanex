import React from 'react'

const AICore = ({ isActive }) => {
  return (
    <div className="relative w-32 h-32">
      {/* Central core */}
      <div className={`
        absolute inset-0 rounded-full 
        bg-gradient-to-br from-jarvis-accent to-jarvis-blue
        ${isActive ? 'animate-pulse-slow' : ''}
      `} style={{
        boxShadow: isActive 
          ? '0 0 40px rgba(0, 229, 255, 0.8), 0 0 80px rgba(0, 229, 255, 0.4)'
          : '0 0 20px rgba(0, 229, 255, 0.4)'
      }}>
      </div>

      {/* Inner circle */}
      <div className="absolute inset-4 rounded-full bg-jarvis-bg border-2 border-jarvis-accent/50 flex items-center justify-center">
        <div className={`text-jarvis-accent text-xs font-bold ${isActive ? 'animate-pulse' : ''}`}>
          {isActive ? 'ACTIVE' : 'IDLE'}
        </div>
      </div>

      {/* Orbiting dots */}
      <div className="absolute inset-0">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute top-1/2 left-1/2 w-2 h-2 -ml-1 -mt-1"
            style={{
              animation: `orbit ${8 + i * 2}s linear infinite`,
              animationDelay: `${i * 1}s`
            }}
          >
            <div className="w-2 h-2 rounded-full bg-jarvis-accent neon-glow"></div>
          </div>
        ))}
      </div>

      {/* Pulsing rings */}
      {isActive && (
        <>
          <div className="absolute inset-0 rounded-full border-2 border-jarvis-accent/30 animate-ping" style={{ animationDuration: '2s' }}></div>
          <div className="absolute inset-0 rounded-full border border-jarvis-accent/20 animate-pulse" style={{ animationDuration: '3s' }}></div>
        </>
      )}
    </div>
  )
}

export default AICore
