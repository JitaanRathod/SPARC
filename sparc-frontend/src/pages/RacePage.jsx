import React, { useState } from 'react'
import { Zap, RefreshCw } from 'lucide-react'
import GraphVisualizer from '../components/GraphVisualizer'
import AlgorithmRace from '../components/AlgorithmRace'
import LoadingSpinner from '../components/LoadingSpinner'
import { useAlgorithm } from '../hooks/useAlgorithm'
import { useGraph } from '../hooks/useGraph'
import { MOCK_GRAPHS } from '../services/mockData'

const PRESETS = Object.keys(MOCK_GRAPHS)

export default function RacePage() {
  const { graph, loadPreset, presetName } = useGraph('medium')
  const { loading, results, run } = useAlgorithm()
  const [hasRun, setHasRun] = useState(false)
  const [source, setSource] = useState(0)

  const handleRace = async () => {
    setHasRun(false)
    await run({ graph, source })
    setHasRun(true)
  }

  return (
    <div className="min-h-screen pt-24 pb-16" style={{ background: 'var(--void)' }}>
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-12 fade-up">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-xs font-mono"
            style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.3)', color: '#a855f7' }}
          >
            <Zap size={12} />
            ALGORITHM RACE MODE
          </div>
          <h1 className="font-display text-4xl font-black mb-3" style={{ color: '#e2ecf8' }}>
            Who's <span style={{ color: '#a855f7' }}>fastest?</span>
          </h1>
          <p className="text-sm max-w-md mx-auto" style={{ color: '#4a6080' }}>
            Watch all 3 algorithms race side-by-side on your chosen graph. Execution time is relative to the slowest.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

          {/* Left: Graph + controls */}
          <div className="space-y-4 fade-up fade-up-2">
            {/* Config */}
            <div className="glass-panel rounded-xl p-5">
              <p className="text-xs font-mono mb-3" style={{ color: '#4a6080' }}>RACE CONFIGURATION</p>
              <div className="flex flex-wrap gap-3 mb-4">
                {PRESETS.map(p => (
                  <button
                    key={p}
                    onClick={() => loadPreset(p)}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono capitalize transition-all duration-200"
                    style={{
                      background: presetName === p ? 'rgba(124,58,237,0.15)' : 'rgba(13,21,38,0.6)',
                      border: `1px solid ${presetName === p ? 'rgba(124,58,237,0.5)' : '#1a2d50'}`,
                      color: presetName === p ? '#a855f7' : '#4a6080',
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono" style={{ color: '#4a6080' }}>SOURCE NODE</span>
                  <input
                    type="number"
                    min={0}
                    max={graph.nodes.length - 1}
                    value={source}
                    onChange={e => setSource(Number(e.target.value))}
                    className="input-cyber w-14 px-2 py-1.5 rounded-lg text-sm text-center"
                  />
                </div>
                <button
                  onClick={handleRace}
                  disabled={loading}
                  className="btn-violet ml-auto flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-sm"
                >
                  {loading
                    ? <><RefreshCw size={14} className="animate-spin" /> RACING...</>
                    : <><Zap size={14} /> START RACE</>
                  }
                </button>
              </div>
            </div>

            {/* Graph preview */}
            <div className="glass-panel rounded-xl overflow-hidden" style={{ height: 340 }}>
              <div className="px-4 py-2.5 flex items-center" style={{ borderBottom: '1px solid #1a2d50' }}>
                <span className="font-display text-xs tracking-widest" style={{ color: '#a855f7' }}>GRAPH PREVIEW</span>
                <span className="ml-auto text-xs font-mono" style={{ color: '#4a6080' }}>
                  {graph.nodes.length}V · {graph.edges.length}E
                </span>
              </div>
              <GraphVisualizer graph={graph} />
            </div>
          </div>

          {/* Right: Race results */}
          <div className="fade-up fade-up-3">
            <div className="glass-panel rounded-xl overflow-hidden h-full">
              <div
                className="px-5 py-4 flex items-center"
                style={{
                  background: 'linear-gradient(90deg, rgba(124,58,237,0.15), transparent)',
                  borderBottom: '1px solid #1a2d50',
                }}
              >
                <span className="font-display text-sm tracking-widest" style={{ color: '#a855f7' }}>RACE RESULTS</span>
                {results && (
                  <span className="ml-auto text-xs font-mono" style={{ color: '#4a6080' }}>
                    source: node {source}
                  </span>
                )}
              </div>

              <div className="p-5">
                {loading && <LoadingSpinner label="ALGORITHMS COMPETING..." />}
                {!loading && !results && (
                  <div className="flex flex-col items-center justify-center py-16 gap-4">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center"
                      style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)' }}
                    >
                      <Zap size={28} color="#a855f7" />
                    </div>
                    <p className="text-xs font-mono" style={{ color: '#4a6080' }}>
                      Press START RACE to begin
                    </p>
                  </div>
                )}
                {!loading && results && (
                  <AlgorithmRace results={results} isRunning={hasRun} />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div
          className="mt-8 rounded-xl p-5 fade-up fade-up-4"
          style={{ background: 'rgba(9,14,26,0.6)', border: '1px solid #1a2d50' }}
        >
          <p className="text-xs font-mono mb-3" style={{ color: '#4a6080' }}>HOW RACE MODE WORKS</p>
          <p className="text-xs leading-relaxed" style={{ color: '#4a6080' }}>
            The bar lengths are proportional to each algorithm's execution time relative to the slowest.
            A shorter bar = faster algorithm. The algorithm with the{' '}
            <span style={{ color: '#f59e0b' }}>smallest bar</span> wins.
            Times are measured from the Java backend's nanosecond-precision timer.
          </p>
        </div>
      </div>
    </div>
  )
}
