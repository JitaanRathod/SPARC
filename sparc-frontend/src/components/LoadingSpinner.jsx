import React from 'react'

export default function LoadingSpinner({ label = 'COMPUTING...', size = 'md' }) {
  const sz = size === 'sm' ? 24 : size === 'lg' ? 56 : 40

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      <div className="relative" style={{ width: sz, height: sz }}>
        {/* Outer ring */}
        <svg width={sz} height={sz} viewBox={`0 0 ${sz} ${sz}`} className="animate-spin" style={{ animationDuration: '1.2s' }}>
          <circle
            cx={sz / 2} cy={sz / 2} r={sz / 2 - 3}
            fill="none"
            stroke="url(#spinner-grad)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={`${sz * 1.8} ${sz * 0.5}`}
          />
          <defs>
            <linearGradient id="spinner-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00e5ff" stopOpacity="0" />
              <stop offset="100%" stopColor="#00e5ff" />
            </linearGradient>
          </defs>
        </svg>
        {/* Inner dot */}
        <div
          className="absolute inset-0 flex items-center justify-center"
        >
          <div
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ background: '#00e5ff', boxShadow: '0 0 8px #00e5ff' }}
          />
        </div>
      </div>
      <p className="text-xs font-mono tracking-widest" style={{ color: '#4a6080' }}>{label}</p>
    </div>
  )
}
