import React, { useState } from 'react'
import { Clock, GitBranch, Activity, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react'
import { ALGO_META } from '../services/mockData'

export default function AlgoResultCard({ result, rank }) {
  const [expanded, setExpanded] = useState(false)
  if (!result) return null

  const meta = ALGO_META[result.algorithm]
  const rankColors = ['#f59e0b', '#8ba3c0', '#cd7c4e']
  const rankLabels = ['1ST', '2ND', '3RD']

  return (
    <div
      className="glass-panel rounded-xl overflow-hidden transition-all duration-300"
      style={{
        borderColor: rank === 0 ? meta.color : undefined,
        boxShadow: rank === 0 ? `0 0 20px ${meta.color}22` : undefined,
      }}
    >
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between"
        style={{ background: `linear-gradient(90deg, ${meta.colorDim}, transparent)` }}>
        <div className="flex items-center gap-3">
          {rank !== undefined && (
            <span className="badge" style={{ color: rankColors[rank], borderColor: `${rankColors[rank]}40`, border: '1px solid', background: `${rankColors[rank]}10` }}>
              {rankLabels[rank]}
            </span>
          )}
          <span className="font-display text-sm font-semibold" style={{ color: meta.color }}>
            {meta.label}
          </span>
        </div>
        <span className="text-xs font-mono" style={{ color: '#4a6080' }}>{meta.javaClass}</span>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-3 gap-0" style={{ borderBottom: '1px solid #1a2d50' }}>
        {[
          { icon: Clock, label: 'TIME', value: `${result.executionTimeMs?.toFixed(2)}ms`, color: meta.color },
          { icon: GitBranch, label: 'NODES', value: result.nodesVisited, color: '#8ba3c0' },
          { icon: Activity, label: 'RELAXATIONS', value: result.relaxations, color: '#8ba3c0' },
        ].map(({ icon: Icon, label, value, color }, i) => (
          <div key={i} className="flex flex-col items-center py-3 px-2"
            style={{ borderRight: i < 2 ? '1px solid #1a2d50' : undefined }}>
            <Icon size={12} style={{ color, marginBottom: 4 }} />
            <span className="font-mono font-bold text-sm" style={{ color }}>{value}</span>
            <span className="text-xs font-mono mt-0.5" style={{ color: '#4a6080' }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Path */}
      {result.path && (
        <div className="px-4 py-3" style={{ borderBottom: '1px solid #1a2d50' }}>
          <p className="text-xs font-mono mb-2" style={{ color: '#4a6080' }}>SHORTEST PATH</p>
          <div className="flex items-center flex-wrap gap-1">
            {result.path.map((node, i) => (
              <React.Fragment key={i}>
                <span className="px-2 py-0.5 rounded text-xs font-mono"
                  style={{ background: `${meta.color}15`, color: meta.color, border: `1px solid ${meta.color}30` }}>
                  {node}
                </span>
                {i < result.path.length - 1 && (
                  <span className="text-xs font-mono" style={{ color: '#1a2d50' }}>→</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* Negative cycle warning */}
      {result.negativeCycleDetected && (
        <div className="px-4 py-2 flex items-center gap-2"
          style={{ background: 'rgba(244,63,94,0.1)', borderBottom: '1px solid rgba(244,63,94,0.2)' }}>
          <AlertTriangle size={12} style={{ color: '#f43f5e' }} />
          <span className="text-xs font-mono" style={{ color: '#f43f5e' }}>Negative cycle detected</span>
        </div>
      )}

      {/* Expandable distances */}
      {result.distances && (
        <div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full px-4 py-2 flex items-center justify-between hover:bg-white/5 transition-colors"
          >
            <span className="text-xs font-mono" style={{ color: '#4a6080' }}>DISTANCES TABLE</span>
            {expanded ? <ChevronUp size={12} color="#4a6080" /> : <ChevronDown size={12} color="#4a6080" />}
          </button>
          {expanded && (
            <div className="px-4 pb-3">
              <div className="grid grid-cols-4 gap-1">
                {Object.entries(result.distances).map(([node, dist]) => (
                  <div key={node} className="flex items-center justify-between px-2 py-1 rounded text-xs font-mono"
                    style={{ background: 'rgba(26,45,80,0.3)' }}>
                    <span style={{ color: '#8ba3c0' }}>{node}</span>
                    <span style={{ color: dist === Infinity ? '#4a6080' : meta.color }}>
                      {dist === Infinity ? '∞' : dist}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
