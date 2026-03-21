import React, { useEffect, useRef, useState } from 'react'
import { Zap } from 'lucide-react'

const ALGOS = [
  { key: 'DIJKSTRA',      label: 'Dijkstra',      color: '#00e5ff', symbol: 'D' },
  { key: 'BELLMAN_FORD',  label: 'Bellman-Ford',  color: '#a855f7', symbol: 'B' },
  { key: 'FLOYD_WARSHALL',label: 'Floyd-Warshall',color: '#f59e0b', symbol: 'F' },
]

export default function AlgorithmRace({ results, isRunning }) {
  const [progress, setProgress] = useState({ DIJKSTRA: 0, BELLMAN_FORD: 0, FLOYD_WARSHALL: 0 })
  const [finished, setFinished] = useState([])
  const frameRef = useRef(null)
  const startRef = useRef(null)

  // Compute targets from results
  const targets = results
    ? (() => {
        const times = Object.fromEntries(results.map(r => [r.algorithm, r.executionTimeMs]))
        const maxT = Math.max(...Object.values(times))
        return Object.fromEntries(Object.entries(times).map(([k, v]) => [k, (v / maxT) * 100]))
      })()
    : { DIJKSTRA: 0, BELLMAN_FORD: 0, FLOYD_WARSHALL: 0 }

  // Animate bars
  useEffect(() => {
    if (!isRunning || !results) return
    setProgress({ DIJKSTRA: 0, BELLMAN_FORD: 0, FLOYD_WARSHALL: 0 })
    setFinished([])
    startRef.current = performance.now()

    const DURATION = 1800

    const tick = (now) => {
      const elapsed = now - startRef.current
      const t = Math.min(elapsed / DURATION, 1)
      // Ease out cubic
      const ease = 1 - Math.pow(1 - t, 3)

      const newProgress = Object.fromEntries(
        Object.entries(targets).map(([k, target]) => [k, ease * target])
      )
      setProgress(newProgress)

      if (t < 1) {
        frameRef.current = requestAnimationFrame(tick)
      } else {
        // Determine finish order by target % (higher % = slower = worse)
        const sorted = Object.entries(targets).sort((a, b) => a[1] - b[1])
        setFinished(sorted.map(([k]) => k))
      }
    }
    frameRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameRef.current)
  }, [isRunning, results])

  const rankColors = ['#f59e0b', '#8ba3c0', '#cd7c4e']
  const rankLabels = ['🥇', '🥈', '🥉']

  return (
    <div className="space-y-4">
      {ALGOS.map(({ key, label, color, symbol }) => {
        const pct = progress[key] || 0
        const rankIdx = finished.indexOf(key)
        const result = results?.find(r => r.algorithm === key)

        return (
          <div key={key} className="space-y-1.5">
            {/* Label row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded flex items-center justify-center text-xs font-mono font-bold"
                  style={{ background: `${color}15`, border: `1px solid ${color}40`, color }}
                >
                  {symbol}
                </div>
                <span className="text-sm font-mono" style={{ color: '#e2ecf8' }}>{label}</span>
                {rankIdx >= 0 && (
                  <span className="text-lg">{rankLabels[rankIdx]}</span>
                )}
              </div>
              <div className="flex items-center gap-3 text-xs font-mono">
                {result && (
                  <span style={{ color: '#4a6080' }}>
                    <span style={{ color }}>{result.executionTimeMs.toFixed(2)}</span>ms
                  </span>
                )}
                <span style={{ color: '#4a6080' }}>{pct.toFixed(0)}%</span>
              </div>
            </div>

            {/* Bar track */}
            <div
              className="relative h-8 rounded-lg overflow-hidden"
              style={{ background: 'rgba(13,21,38,0.8)', border: '1px solid #1a2d50' }}
            >
              {/* Fill */}
              <div
                className="absolute inset-y-0 left-0 rounded-lg transition-none"
                style={{
                  width: `${pct}%`,
                  background: `linear-gradient(90deg, ${color}30, ${color}80)`,
                  boxShadow: pct > 5 ? `0 0 20px ${color}40` : 'none',
                  borderRight: pct > 0 ? `2px solid ${color}` : 'none',
                }}
              />
              {/* Scan line effect */}
              {isRunning && pct > 0 && pct < 100 && (
                <div
                  className="absolute inset-y-0 w-8"
                  style={{
                    left: `calc(${pct}% - 32px)`,
                    background: `linear-gradient(90deg, transparent, ${color}60, transparent)`,
                    filter: 'blur(4px)',
                  }}
                />
              )}
              {/* Grid lines */}
              {[25, 50, 75].map(g => (
                <div
                  key={g}
                  className="absolute inset-y-0 w-px"
                  style={{ left: `${g}%`, background: 'rgba(26,45,80,0.6)' }}
                />
              ))}
              {/* Relaxation counter */}
              {result && (
                <div className="absolute inset-y-0 right-2 flex items-center">
                  <span className="text-xs font-mono" style={{ color: 'rgba(74,96,128,0.8)' }}>
                    {result.relaxations} relax
                  </span>
                </div>
              )}
            </div>
          </div>
        )
      })}

      {/* Winner announcement */}
      {finished.length === 3 && results && (
        <div
          className="rounded-xl p-4 mt-4 text-center fade-up"
          style={{
            background: 'rgba(0,229,255,0.05)',
            border: '1px solid rgba(0,229,255,0.2)',
          }}
        >
          <div className="flex items-center justify-center gap-2 mb-1">
            <Zap size={14} color="#00e5ff" />
            <span className="font-display text-sm tracking-widest" style={{ color: '#00e5ff' }}>FASTEST ALGORITHM</span>
          </div>
          <p className="font-display text-xl font-bold" style={{ color: '#ffffff' }}>
            {ALGOS.find(a => a.key === finished[0])?.label}
          </p>
          <p className="text-xs font-mono mt-1" style={{ color: '#4a6080' }}>
            on this graph · {results.find(r => r.algorithm === finished[0])?.executionTimeMs.toFixed(2)}ms
          </p>
        </div>
      )}
    </div>
  )
}
