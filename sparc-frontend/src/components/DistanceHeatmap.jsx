import React, { useMemo } from 'react'

function interpolateColor(t) {
  // Deep navy → cyan gradient
  const r = Math.round(5 + t * (0 - 5))
  const g = Math.round(8 + t * (229 - 8))
  const b = Math.round(18 + t * (255 - 18))
  return `rgb(${r},${g},${b})`
}

export default function DistanceHeatmap({ matrix, nodeLabels }) {
  if (!matrix || !matrix.length) return (
    <div className="flex items-center justify-center h-40">
      <p className="text-xs font-mono" style={{ color: '#4a6080' }}>Run Floyd-Warshall to see distance matrix</p>
    </div>
  )

  const n = matrix.length
  const labels = nodeLabels || Array.from({ length: n }, (_, i) => String.fromCharCode(65 + i))

  const { min, max } = useMemo(() => {
    let min = Infinity, max = -Infinity
    matrix.forEach(row => row.forEach(v => {
      if (v !== Infinity && v !== null) {
        min = Math.min(min, v)
        max = Math.max(max, v)
      }
    }))
    return { min, max }
  }, [matrix])

  const normalize = (v) => {
    if (v === Infinity || v === null) return -1
    if (max === min) return 0.5
    return (v - min) / (max - min)
  }

  const cellSize = Math.min(40, Math.floor(400 / (n + 1)))

  return (
    <div className="overflow-auto">
      <div className="inline-block">
        <div className="flex">
          {/* Top-left corner */}
          <div style={{ width: cellSize, height: cellSize }} />
          {/* Column headers */}
          {labels.map((l, i) => (
            <div
              key={i}
              className="flex items-center justify-center text-xs font-mono flex-shrink-0"
              style={{ width: cellSize, height: cellSize, color: '#4a6080' }}
            >
              {l}
            </div>
          ))}
        </div>

        {matrix.map((row, i) => (
          <div key={i} className="flex">
            {/* Row header */}
            <div
              className="flex items-center justify-center text-xs font-mono flex-shrink-0"
              style={{ width: cellSize, height: cellSize, color: '#4a6080' }}
            >
              {labels[i]}
            </div>
            {/* Cells */}
            {row.map((val, j) => {
              const t = normalize(val)
              const isInf = val === Infinity || val === null
              const isDiag = i === j
              return (
                <div
                  key={j}
                  className="heatmap-cell flex items-center justify-center text-xs font-mono flex-shrink-0 relative rounded-sm cursor-default"
                  style={{
                    width: cellSize,
                    height: cellSize,
                    background: isDiag
                      ? 'rgba(0,229,255,0.08)'
                      : isInf
                        ? 'rgba(244,63,94,0.08)'
                        : interpolateColor(t * 0.7),
                    color: isDiag ? '#00e5ff' : isInf ? '#4a6080' : t > 0.5 ? '#050812' : '#e2ecf8',
                    border: isDiag
                      ? '1px solid rgba(0,229,255,0.2)'
                      : '1px solid rgba(26,45,80,0.4)',
                    fontSize: cellSize < 32 ? 8 : 10,
                  }}
                  title={`${labels[i]} → ${labels[j]}: ${isInf ? '∞' : val}`}
                >
                  {isInf ? '∞' : isDiag ? '0' : val}
                </div>
              )
            })}
          </div>
        ))}
      </div>

      {/* Color scale legend */}
      <div className="flex items-center gap-3 mt-3">
        <span className="text-xs font-mono" style={{ color: '#4a6080' }}>min:{min === Infinity ? '—' : min}</span>
        <div
          className="flex-1 h-2 rounded"
          style={{
            background: 'linear-gradient(90deg, rgba(5,8,18,1) 0%, #00e5ff 100%)',
            border: '1px solid #1a2d50',
          }}
        />
        <span className="text-xs font-mono" style={{ color: '#4a6080' }}>max:{max === -Infinity ? '—' : max}</span>
      </div>
    </div>
  )
}
