import React, { useState } from 'react'
import { Check, X, Info } from 'lucide-react'
import { ALGO_META } from '../services/mockData'

const COMPLEXITY_NOTES = {
  time: {
    DIJKSTRA: 'Uses a min-heap priority queue. Each vertex extracted once, each edge relaxed once.',
    BELLMAN_FORD: 'Relaxes all |E| edges |V|−1 times. Extra pass detects negative cycles.',
    FLOYD_WARSHALL: 'Triple nested loop over all vertex pairs. All-pairs result in O(V³) ops.',
  },
  space: {
    DIJKSTRA: 'Distance array + priority queue. Queue holds at most |V| entries.',
    BELLMAN_FORD: 'Distance array only. No auxiliary data structure needed.',
    FLOYD_WARSHALL: 'Requires V×V distance matrix. Grows quadratically with graph size.',
  },
}

const GROWTH_ROWS = [
  { v: 10,   e: 45,  dijk: '<1ms',  bf: '<1ms',  fw: '<1ms'  },
  { v: 100,  e: 4950, dijk: '~2ms', bf: '~15ms', fw: '~28ms' },
  { v: 500,  e: 124750, dijk: '~30ms', bf: '~350ms', fw: '~3s' },
  { v: 1000, e: 499500, dijk: '~120ms', bf: '~2s', fw: '~25s' },
]

export default function ComplexityTable() {
  const [hovered, setHovered] = useState(null)
  const [activeNote, setActiveNote] = useState(null)

  const algos = Object.entries(ALGO_META)

  return (
    <div className="space-y-8">
      {/* Big-O Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {algos.map(([key, meta]) => (
          <div
            key={key}
            className="glass-panel rounded-xl p-5 transition-all duration-300"
            style={{ borderColor: hovered === key ? meta.color : undefined, boxShadow: hovered === key ? `0 0 25px ${meta.color}22` : undefined }}
            onMouseEnter={() => setHovered(key)}
            onMouseLeave={() => setHovered(null)}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="font-display text-sm font-semibold" style={{ color: meta.color }}>{meta.label}</span>
              <span className="badge" style={{ color: meta.color, border: `1px solid ${meta.colorBorder}`, background: meta.colorDim }}>
                {meta.javaClass}
              </span>
            </div>

            {/* Time complexity */}
            <div className="mb-3">
              <p className="text-xs font-mono mb-1" style={{ color: '#4a6080' }}>TIME COMPLEXITY</p>
              <div className="flex items-center justify-between">
                <code className="text-lg font-mono font-bold" style={{ color: meta.color }}>{meta.timeComplexity}</code>
                <button
                  onClick={() => setActiveNote(activeNote === `time-${key}` ? null : `time-${key}`)}
                  className="p-1 rounded hover:bg-white/5 transition-colors"
                >
                  <Info size={13} color="#4a6080" />
                </button>
              </div>
              {activeNote === `time-${key}` && (
                <p className="text-xs mt-2 leading-relaxed" style={{ color: '#8ba3c0' }}>
                  {COMPLEXITY_NOTES.time[key]}
                </p>
              )}
            </div>

            {/* Space complexity */}
            <div className="mb-4">
              <p className="text-xs font-mono mb-1" style={{ color: '#4a6080' }}>SPACE COMPLEXITY</p>
              <div className="flex items-center justify-between">
                <code className="text-base font-mono" style={{ color: '#8ba3c0' }}>{meta.spaceComplexity}</code>
                <button
                  onClick={() => setActiveNote(activeNote === `space-${key}` ? null : `space-${key}`)}
                  className="p-1 rounded hover:bg-white/5 transition-colors"
                >
                  <Info size={13} color="#4a6080" />
                </button>
              </div>
              {activeNote === `space-${key}` && (
                <p className="text-xs mt-2 leading-relaxed" style={{ color: '#8ba3c0' }}>
                  {COMPLEXITY_NOTES.space[key]}
                </p>
              )}
            </div>

            {/* Feature flags */}
            <div className="space-y-1.5 pt-3" style={{ borderTop: '1px solid #1a2d50' }}>
              {[
                { label: 'Negative weights', val: meta.supportsNegative },
                { label: 'All-pairs shortest path', val: meta.allPairs },
                { label: 'Negative cycle detection', val: key === 'BELLMAN_FORD' || key === 'FLOYD_WARSHALL' },
                { label: 'Single-source', val: !meta.allPairs },
              ].map(({ label, val }) => (
                <div key={label} className="flex items-center justify-between text-xs font-mono">
                  <span style={{ color: '#4a6080' }}>{label}</span>
                  {val
                    ? <Check size={12} color="#10b981" />
                    : <X size={12} color="#f43f5e" />
                  }
                </div>
              ))}
            </div>

            <p className="text-xs mt-4 leading-relaxed" style={{ color: '#4a6080', borderTop: '1px solid #1a2d50', paddingTop: 12 }}>
              {meta.description}
            </p>
          </div>
        ))}
      </div>

      {/* Comparison Table */}
      <div>
        <h3 className="font-display text-sm tracking-widest mb-4" style={{ color: '#8ba3c0' }}>COMPARISON MATRIX</h3>
        <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid #1a2d50' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'rgba(13,21,38,0.9)', borderBottom: '1px solid #1a2d50' }}>
                <th className="px-4 py-3 text-left text-xs font-mono" style={{ color: '#4a6080' }}>PROPERTY</th>
                {algos.map(([key, meta]) => (
                  <th key={key} className="px-4 py-3 text-center text-xs font-mono" style={{ color: meta.color }}>{meta.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { label: 'Time', values: algos.map(([k, m]) => m.timeComplexity), type: 'code' },
                { label: 'Space', values: algos.map(([k, m]) => m.spaceComplexity), type: 'code' },
                { label: 'Negative edges', values: algos.map(([k, m]) => m.supportsNegative), type: 'bool' },
                { label: 'All-pairs', values: algos.map(([k, m]) => m.allPairs), type: 'bool' },
                { label: 'Neg cycle detect', values: [false, true, true], type: 'bool' },
                { label: 'Best for', values: ['Sparse graphs', 'Negative weights', 'Dense / all-pairs'], type: 'text' },
              ].map(({ label, values, type }, ri) => (
                <tr key={ri} style={{ borderBottom: '1px solid rgba(26,45,80,0.4)', background: ri % 2 ? 'rgba(13,21,38,0.3)' : 'transparent' }}>
                  <td className="px-4 py-3 text-xs font-mono" style={{ color: '#8ba3c0' }}>{label}</td>
                  {values.map((v, ci) => (
                    <td key={ci} className="px-4 py-3 text-center">
                      {type === 'bool' ? (
                        v ? <Check size={14} color="#10b981" className="mx-auto" /> : <X size={14} color="#f43f5e" className="mx-auto" />
                      ) : type === 'code' ? (
                        <code className="text-xs font-mono" style={{ color: algos[ci][1].color }}>{v}</code>
                      ) : (
                        <span className="text-xs font-mono" style={{ color: '#8ba3c0' }}>{v}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Growth Table */}
      <div>
        <h3 className="font-display text-sm tracking-widest mb-4" style={{ color: '#8ba3c0' }}>ESTIMATED RUNTIME GROWTH (dense graph)</h3>
        <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid #1a2d50' }}>
          <table className="w-full text-xs font-mono">
            <thead>
              <tr style={{ background: 'rgba(13,21,38,0.9)', borderBottom: '1px solid #1a2d50' }}>
                {['|V|', '|E| (max)', 'Dijkstra', 'Bellman-Ford', 'Floyd-Warshall'].map((h, i) => (
                  <th key={i} className="px-4 py-2 text-left" style={{ color: i > 1 ? ['#00e5ff','#a855f7','#f59e0b'][i-2] : '#4a6080' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {GROWTH_ROWS.map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(26,45,80,0.4)', background: i % 2 ? 'rgba(13,21,38,0.3)' : 'transparent' }}>
                  <td className="px-4 py-2" style={{ color: '#8ba3c0' }}>{row.v.toLocaleString()}</td>
                  <td className="px-4 py-2" style={{ color: '#4a6080' }}>{row.e.toLocaleString()}</td>
                  <td className="px-4 py-2" style={{ color: '#00e5ff' }}>{row.dijk}</td>
                  <td className="px-4 py-2" style={{ color: '#a855f7' }}>{row.bf}</td>
                  <td className="px-4 py-2" style={{ color: '#f59e0b' }}>{row.fw}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
