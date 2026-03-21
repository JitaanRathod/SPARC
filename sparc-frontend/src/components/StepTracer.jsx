import React, { useState, useEffect, useRef } from 'react'
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react'

export default function StepTracer({ path, algorithm, graph }) {
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const intervalRef = useRef(null)

  const total = path?.length || 0

  useEffect(() => {
    setStep(0)
    setPlaying(false)
  }, [path])

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setStep(s => {
          if (s >= total - 1) { setPlaying(false); return s }
          return s + 1
        })
      }, 700)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [playing, total])

  if (!path?.length) return (
    <div className="flex items-center justify-center h-24">
      <p className="text-xs font-mono" style={{ color: '#4a6080' }}>Run an algorithm to trace the path</p>
    </div>
  )

  const algoColors = { DIJKSTRA: '#00e5ff', BELLMAN_FORD: '#a855f7', FLOYD_WARSHALL: '#f59e0b' }
  const color = algoColors[algorithm] || '#00e5ff'

  // Build step info
  const currentNode = path[step]
  const edgeToHere = step > 0
    ? graph?.edges?.find(e =>
        (e.source === path[step - 1] && e.target === currentNode) ||
        (!graph.directed && e.source === currentNode && e.target === path[step - 1])
      )
    : null

  return (
    <div className="space-y-4">
      {/* Path nodes */}
      <div className="flex items-center flex-wrap gap-1 py-3 px-4 rounded-lg" style={{ background: 'rgba(9,14,26,0.8)', border: '1px solid #1a2d50' }}>
        {path.map((node, i) => {
          const isActive = i === step
          const isPast = i < step
          const label = graph?.nodes?.find(n => n.id === node)?.label || node
          return (
            <React.Fragment key={i}>
              <button
                onClick={() => setStep(i)}
                className="px-2.5 py-1 rounded text-xs font-mono transition-all duration-300"
                style={{
                  background: isActive ? `${color}25` : isPast ? `${color}10` : 'rgba(26,45,80,0.3)',
                  border: `1px solid ${isActive ? color : isPast ? `${color}40` : '#1a2d50'}`,
                  color: isActive ? '#ffffff' : isPast ? color : '#4a6080',
                  boxShadow: isActive ? `0 0 12px ${color}40` : 'none',
                  transform: isActive ? 'scale(1.1)' : 'scale(1)',
                }}
              >
                {label}
              </button>
              {i < path.length - 1 && (
                <span className="text-xs font-mono transition-all duration-300" style={{ color: i < step ? color : '#1a2d50' }}>→</span>
              )}
            </React.Fragment>
          )
        })}
      </div>

      {/* Step info */}
      <div className="rounded-lg px-4 py-3 space-y-1" style={{ background: 'rgba(9,14,26,0.6)', border: `1px solid ${color}30` }}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono" style={{ color: '#4a6080' }}>STEP {step + 1} / {total}</span>
          <span className="text-xs font-mono" style={{ color }}>
            {step === 0 ? 'SOURCE NODE' : step === total - 1 ? 'DESTINATION REACHED' : 'TRAVERSING'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-display font-bold" style={{ color }}>
            {graph?.nodes?.find(n => n.id === currentNode)?.label || currentNode}
          </span>
          {edgeToHere && (
            <span className="text-xs font-mono" style={{ color: '#4a6080' }}>
              ← edge weight <span style={{ color: edgeToHere.weight < 0 ? '#f43f5e' : '#8ba3c0' }}>{edgeToHere.weight}</span>
            </span>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => setStep(0)}
          className="p-2 rounded-lg hover:bg-white/5 transition-colors"
          disabled={step === 0}
          style={{ opacity: step === 0 ? 0.3 : 1 }}
        >
          <SkipBack size={16} color={color} />
        </button>
        <button
          onClick={() => setStep(s => Math.max(0, s - 1))}
          className="p-2 rounded-lg hover:bg-white/5 transition-colors"
          disabled={step === 0}
          style={{ opacity: step === 0 ? 0.3 : 1 }}
        >
          <SkipBack size={14} color="#8ba3c0" />
        </button>
        <button
          onClick={() => setPlaying(p => !p)}
          className="px-5 py-2 rounded-lg flex items-center gap-2 transition-all duration-200"
          style={{
            background: `${color}20`,
            border: `1px solid ${color}50`,
            color,
          }}
        >
          {playing ? <Pause size={16} /> : <Play size={16} />}
          <span className="text-xs font-mono">{playing ? 'PAUSE' : 'PLAY'}</span>
        </button>
        <button
          onClick={() => setStep(s => Math.min(total - 1, s + 1))}
          className="p-2 rounded-lg hover:bg-white/5 transition-colors"
          disabled={step === total - 1}
          style={{ opacity: step === total - 1 ? 0.3 : 1 }}
        >
          <SkipForward size={14} color="#8ba3c0" />
        </button>
        <button
          onClick={() => setStep(total - 1)}
          className="p-2 rounded-lg hover:bg-white/5 transition-colors"
          disabled={step === total - 1}
          style={{ opacity: step === total - 1 ? 0.3 : 1 }}
        >
          <SkipForward size={16} color={color} />
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-1 rounded-full overflow-hidden" style={{ background: '#1a2d50' }}>
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${total > 1 ? (step / (total - 1)) * 100 : 100}%`,
            background: `linear-gradient(90deg, ${color}80, ${color})`,
            boxShadow: `0 0 8px ${color}60`,
          }}
        />
      </div>
    </div>
  )
}
