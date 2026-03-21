import React, { useState } from 'react'
import { Play, RefreshCw, Download } from 'lucide-react'
import BenchmarkCharts from '../components/BenchmarkCharts'
import LoadingSpinner from '../components/LoadingSpinner'
import { useBenchmark } from '../hooks/useBenchmark'

const DENSITY_OPTS = ['SPARSE', 'DENSE']
const SIZES_OPTS = [
  { label: 'Quick (3 sizes)', value: [10, 100, 500] },
  { label: 'Standard (5 sizes)', value: [10, 50, 100, 200, 500] },
  { label: 'Full (7 sizes)', value: [10, 25, 50, 100, 200, 500, 1000] },
]

export default function BenchmarkPage() {
  const { loading, data, error, run } = useBenchmark()
  const [density, setDensity] = useState('SPARSE')
  const [sizePreset, setSizePreset] = useState(1)
  const [runs, setRuns] = useState(5)

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sparc-benchmark-${density.toLowerCase()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleExportCSV = () => {
    const header = 'size,dijkstra_ms,bellman_ford_ms,floyd_warshall_ms\n'
    const rows = data.map(r => `${r.size},${r.dijkstra.toFixed(4)},${r.bellmanFord.toFixed(4)},${r.floydWarshall.toFixed(4)}`).join('\n')
    const blob = new Blob([header + rows], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'sparc-benchmark.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen pt-24 pb-16 grid-bg">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="mb-8 fade-up">
          <h1 className="font-display text-2xl font-bold tracking-wide mb-1" style={{ color: '#e2ecf8' }}>
            Benchmark Suite
          </h1>
          <p className="text-sm" style={{ color: '#4a6080' }}>
            Compare execution time across graph sizes. All measurements from the Java backend.
          </p>
        </div>

        {/* Config panel */}
        <div className="glass-panel rounded-xl p-5 mb-6 fade-up fade-up-2">
          <div className="flex flex-wrap items-end gap-6">
            {/* Density */}
            <div>
              <label className="block text-xs font-mono mb-2" style={{ color: '#4a6080' }}>GRAPH DENSITY</label>
              <div className="flex gap-2">
                {DENSITY_OPTS.map(d => (
                  <button
                    key={d}
                    onClick={() => setDensity(d)}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-200"
                    style={{
                      background: density === d ? 'rgba(0,229,255,0.12)' : 'rgba(13,21,38,0.6)',
                      border: `1px solid ${density === d ? 'rgba(0,229,255,0.4)' : '#1a2d50'}`,
                      color: density === d ? '#00e5ff' : '#4a6080',
                    }}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Size preset */}
            <div>
              <label className="block text-xs font-mono mb-2" style={{ color: '#4a6080' }}>SIZE PRESET</label>
              <div className="flex gap-2 flex-wrap">
                {SIZES_OPTS.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setSizePreset(i)}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-200"
                    style={{
                      background: sizePreset === i ? 'rgba(245,158,11,0.12)' : 'rgba(13,21,38,0.6)',
                      border: `1px solid ${sizePreset === i ? 'rgba(245,158,11,0.4)' : '#1a2d50'}`,
                      color: sizePreset === i ? '#f59e0b' : '#4a6080',
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Runs */}
            <div>
              <label className="block text-xs font-mono mb-2" style={{ color: '#4a6080' }}>RUNS / SIZE</label>
              <input
                type="number"
                min={1}
                max={20}
                value={runs}
                onChange={e => setRuns(Number(e.target.value))}
                className="input-cyber w-16 px-2 py-1.5 rounded-lg text-sm text-center"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2 ml-auto">
              <button
                onClick={() => run({ sizes: SIZES_OPTS[sizePreset].value, density, runs })}
                disabled={loading}
                className="btn-primary flex items-center gap-2 px-5 py-2 rounded-lg font-mono text-sm"
              >
                {loading ? <RefreshCw size={14} className="animate-spin" /> : <Play size={14} />}
                {loading ? 'RUNNING...' : 'RUN BENCHMARK'}
              </button>
              {data?.length > 0 && (
                <>
                  <button onClick={handleExport} className="btn-amber flex items-center gap-2 px-3 py-2 rounded-lg font-mono text-sm">
                    <Download size={14} /> JSON
                  </button>
                  <button onClick={handleExportCSV} className="btn-amber flex items-center gap-2 px-3 py-2 rounded-lg font-mono text-sm">
                    <Download size={14} /> CSV
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="glass-panel rounded-xl p-6 fade-up fade-up-3">
          {loading
            ? <LoadingSpinner label="BENCHMARKING ALL ALGORITHMS..." size="lg" />
            : error
              ? <p className="text-xs font-mono text-center py-8" style={{ color: '#f43f5e' }}>{error}</p>
              : <BenchmarkCharts data={data} />
          }
        </div>

        {/* Interpretation tips */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 fade-up fade-up-4">
          {[
            { title: 'Dijkstra wins on sparse', desc: "For small-to-medium graphs without negative edges, Dijkstra's O((V+E)logV) is typically fastest due to priority queue efficiency.", color: '#00e5ff' },
            { title: 'Bellman-Ford for negative edges', desc: "The only single-source algorithm that handles negative weights. Linear O(VE) is expensive but necessary when weights are negative.", color: '#a855f7' },
            { title: 'Floyd-Warshall scales cubically', desc: "All-pairs result is its strength. O(V\u00B3) makes it impractical for V > 500, but ideal for dense small graphs needing all distances.", color: '#f59e0b' },
          ].map(({ title, desc, color }) => (
            <div key={title} className="glass-panel rounded-xl p-4">
              <p className="text-xs font-mono font-semibold mb-2" style={{ color }}>{title}</p>
              <p className="text-xs leading-relaxed" style={{ color: '#4a6080' }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
