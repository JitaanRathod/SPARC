import React, { useState } from 'react'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine
} from 'recharts'

const ALGO_COLORS = {
  dijkstra: '#00e5ff',
  bellmanFord: '#a855f7',
  floydWarshall: '#f59e0b',
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-panel rounded-lg px-4 py-3" style={{ border: '1px solid #1a2d50', minWidth: 160 }}>
      <p className="text-xs font-mono mb-2" style={{ color: '#4a6080' }}>SIZE: {label} nodes</p>
      {payload.map(p => (
        <div key={p.dataKey} className="flex items-center justify-between gap-4 text-xs font-mono mb-1">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span style={{ color: '#8ba3c0' }}>{p.name}</span>
          </div>
          <span style={{ color: p.color }}>{typeof p.value === 'number' ? p.value.toFixed(2) : p.value}ms</span>
        </div>
      ))}
    </div>
  )
}

const CustomLegend = ({ payload }) => (
  <div className="flex justify-center gap-6 mt-3">
    {payload?.map(p => (
      <div key={p.value} className="flex items-center gap-2 text-xs font-mono" style={{ color: '#8ba3c0' }}>
        <div className="w-3 h-0.5" style={{ background: p.color }} />
        {p.value}
      </div>
    ))}
  </div>
)

const axisStyle = { fill: '#4a6080', fontSize: 10, fontFamily: 'JetBrains Mono' }
const gridStyle = { stroke: '#1a2d50', strokeDasharray: '3 3' }

export default function BenchmarkCharts({ data }) {
  const [view, setView] = useState('line')

  if (!data?.length) return (
    <div className="flex items-center justify-center h-48">
      <p className="text-xs font-mono" style={{ color: '#4a6080' }}>No benchmark data. Run benchmark first.</p>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Toggle */}
      <div className="flex gap-2">
        {[
          { key: 'line', label: 'LINE — Perf vs Size' },
          { key: 'bar',  label: 'BAR — Per Dataset' },
        ].map(v => (
          <button
            key={v.key}
            onClick={() => setView(v.key)}
            className="px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-200"
            style={{
              background: view === v.key ? 'rgba(0,229,255,0.12)' : 'rgba(13,21,38,0.6)',
              border: `1px solid ${view === v.key ? 'rgba(0,229,255,0.4)' : '#1a2d50'}`,
              color: view === v.key ? '#00e5ff' : '#4a6080',
            }}
          >
            {v.label}
          </button>
        ))}
      </div>

      {/* Line chart */}
      {view === 'line' && (
        <div>
          <p className="text-xs font-mono mb-4" style={{ color: '#4a6080' }}>
            Execution time (ms) vs. graph size — log scale
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid {...gridStyle} />
              <XAxis dataKey="size" tick={axisStyle} label={{ value: 'nodes', position: 'insideBottomRight', offset: -5, style: axisStyle }} />
              <YAxis scale="log" domain={['auto', 'auto']} tick={axisStyle} label={{ value: 'ms (log)', angle: -90, position: 'insideLeft', style: axisStyle }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
              <Line type="monotone" dataKey="dijkstra" name="Dijkstra" stroke={ALGO_COLORS.dijkstra} strokeWidth={2} dot={{ fill: ALGO_COLORS.dijkstra, r: 4 }} activeDot={{ r: 6, filter: 'url(#glow)' }} />
              <Line type="monotone" dataKey="bellmanFord" name="Bellman-Ford" stroke={ALGO_COLORS.bellmanFord} strokeWidth={2} dot={{ fill: ALGO_COLORS.bellmanFord, r: 4 }} />
              <Line type="monotone" dataKey="floydWarshall" name="Floyd-Warshall" stroke={ALGO_COLORS.floydWarshall} strokeWidth={2} dot={{ fill: ALGO_COLORS.floydWarshall, r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Bar chart */}
      {view === 'bar' && (
        <div>
          <p className="text-xs font-mono mb-4" style={{ color: '#4a6080' }}>
            Time per algorithm per dataset size
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }} barCategoryGap="20%">
              <CartesianGrid {...gridStyle} />
              <XAxis dataKey="size" tick={axisStyle} />
              <YAxis tick={axisStyle} />
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
              <Bar dataKey="dijkstra" name="Dijkstra" fill={ALGO_COLORS.dijkstra} fillOpacity={0.8} radius={[3, 3, 0, 0]} />
              <Bar dataKey="bellmanFord" name="Bellman-Ford" fill={ALGO_COLORS.bellmanFord} fillOpacity={0.8} radius={[3, 3, 0, 0]} />
              <Bar dataKey="floydWarshall" name="Floyd-Warshall" fill={ALGO_COLORS.floydWarshall} fillOpacity={0.8} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Summary table */}
      <div>
        <p className="text-xs font-mono mb-3" style={{ color: '#4a6080' }}>RAW RESULTS (ms)</p>
        <div className="overflow-x-auto rounded-lg" style={{ border: '1px solid #1a2d50' }}>
          <table className="w-full text-xs font-mono">
            <thead>
              <tr style={{ background: 'rgba(13,21,38,0.9)', borderBottom: '1px solid #1a2d50' }}>
                <th className="px-3 py-2 text-left" style={{ color: '#4a6080' }}>SIZE</th>
                <th className="px-3 py-2 text-right" style={{ color: '#00e5ff' }}>DIJKSTRA</th>
                <th className="px-3 py-2 text-right" style={{ color: '#a855f7' }}>BELLMAN-FORD</th>
                <th className="px-3 py-2 text-right" style={{ color: '#f59e0b' }}>FLOYD-WARSHALL</th>
                <th className="px-3 py-2 text-right" style={{ color: '#4a6080' }}>FASTEST</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => {
                const fastest = Math.min(row.dijkstra, row.bellmanFord, row.floydWarshall)
                const fastestName = row.dijkstra === fastest ? 'Dijkstra' : row.bellmanFord === fastest ? 'Bellman-Ford' : 'Floyd-Warshall'
                const fastestColor = row.dijkstra === fastest ? '#00e5ff' : row.bellmanFord === fastest ? '#a855f7' : '#f59e0b'
                return (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(26,45,80,0.4)', background: i % 2 ? 'rgba(13,21,38,0.3)' : 'transparent' }}>
                    <td className="px-3 py-2" style={{ color: '#8ba3c0' }}>{row.size}</td>
                    <td className="px-3 py-2 text-right" style={{ color: '#00e5ff' }}>{row.dijkstra.toFixed(2)}</td>
                    <td className="px-3 py-2 text-right" style={{ color: '#a855f7' }}>{row.bellmanFord.toFixed(2)}</td>
                    <td className="px-3 py-2 text-right" style={{ color: '#f59e0b' }}>{row.floydWarshall.toFixed(2)}</td>
                    <td className="px-3 py-2 text-right">
                      <span className="badge" style={{ color: fastestColor, border: `1px solid ${fastestColor}40`, background: `${fastestColor}10` }}>
                        {fastestName}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
