import React, { useState } from 'react'
import { Play, RefreshCw, ChevronDown } from 'lucide-react'
import GraphVisualizer from '../components/GraphVisualizer'
import GraphInputForm from '../components/GraphInputForm'
import AlgoResultCard from '../components/AlgoResultCard'
import StepTracer from '../components/StepTracer'
import DistanceHeatmap from '../components/DistanceHeatmap'
import LoadingSpinner from '../components/LoadingSpinner'
import { useAlgorithm } from '../hooks/useAlgorithm'
import { useGraph } from '../hooks/useGraph'
import { ALGO_META } from '../services/mockData'

const ALGO_OPTIONS = [
  { value: 'ALL',          label: 'All Algorithms', color: '#e2ecf8' },
  { value: 'DIJKSTRA',     label: 'Dijkstra',       color: '#00e5ff' },
  { value: 'BELLMAN_FORD', label: 'Bellman-Ford',   color: '#a855f7' },
  { value: 'FLOYD_WARSHALL', label: 'Floyd-Warshall', color: '#f59e0b' },
]

export default function VisualizerPage() {
  const { graph, presetName, loadPreset, addNode, addEdge, removeNode, removeEdge, reset } = useGraph('small')
  const { loading, results, error, run } = useAlgorithm()

  const [sourceNode, setSourceNode] = useState(0)
  const [targetNode, setTargetNode] = useState(4)
  const [selectedAlgo, setSelectedAlgo] = useState('ALL')
  const [activeResult, setActiveResult] = useState(0)
  const [rightTab, setRightTab] = useState('results')

  const handleRun = async () => {
    await run({
      graph,
      source: sourceNode,
      target: targetNode,
      algorithm: selectedAlgo === 'ALL' ? null : selectedAlgo,
    })
  }

  const currentResult = results?.[activeResult]
  const highlightPath = currentResult?.path || []
  const fwResult = results?.find(r => r.algorithm === 'FLOYD_WARSHALL')

  // Sort results by execution time
  const sortedResults = results
    ? [...results].sort((a, b) => a.executionTimeMs - b.executionTimeMs)
    : []

  return (
    <div className="min-h-screen pt-20 pb-8 grid-bg" style={{ background: 'var(--void)' }}>
      <div className="max-w-7xl mx-auto px-4">

        {/* Page header */}
        <div className="flex items-center justify-between mb-6 pt-4">
          <div>
            <h1 className="font-display text-xl font-bold tracking-wide" style={{ color: '#e2ecf8' }}>
              Graph Visualizer
            </h1>
            <p className="text-xs font-mono mt-0.5" style={{ color: '#4a6080' }}>
              {graph.nodes.length}V · {graph.edges.length}E · {graph.directed ? 'directed' : 'undirected'} · preset: {presetName}
            </p>
          </div>

          {/* Run controls */}
          <div className="flex items-center gap-3">
            {/* Source / Target */}
            {['Source', 'Target'].map((label, i) => (
              <div key={label} className="flex items-center gap-2">
                <span className="text-xs font-mono hidden sm:block" style={{ color: '#4a6080' }}>{label}</span>
                <input
                  type="number"
                  min={0}
                  max={graph.nodes.length - 1}
                  value={i === 0 ? sourceNode : targetNode}
                  onChange={e => i === 0 ? setSourceNode(Number(e.target.value)) : setTargetNode(Number(e.target.value))}
                  className="input-cyber w-14 px-2 py-1.5 rounded-lg text-sm text-center"
                />
              </div>
            ))}

            {/* Algo selector */}
            <div className="relative">
              <select
                value={selectedAlgo}
                onChange={e => setSelectedAlgo(e.target.value)}
                className="input-cyber pl-3 pr-8 py-1.5 rounded-lg text-xs appearance-none cursor-pointer"
              >
                {ALGO_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <ChevronDown size={12} color="#4a6080" className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Run button */}
            <button
              onClick={handleRun}
              disabled={loading}
              className="btn-primary flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xs"
            >
              {loading ? <RefreshCw size={13} className="animate-spin" /> : <Play size={13} />}
              {loading ? 'RUNNING...' : 'RUN'}
            </button>
          </div>
        </div>

        {/* Main grid: canvas left, panel right */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-4">

          {/* Graph canvas */}
          <div className="glass-panel rounded-xl overflow-hidden" style={{ minHeight: 500 }}>
            <div className="px-4 py-2.5 flex items-center justify-between" style={{ borderBottom: '1px solid #1a2d50' }}>
              <span className="font-display text-xs tracking-widest" style={{ color: '#00e5ff' }}>GRAPH CANVAS</span>
              {results && (
                <div className="flex gap-2">
                  {results.map((r, i) => (
                    <button
                      key={r.algorithm}
                      onClick={() => setActiveResult(i)}
                      className="px-2 py-1 rounded text-xs font-mono transition-all duration-200"
                      style={{
                        color: ALGO_META[r.algorithm].color,
                        background: activeResult === i ? `${ALGO_META[r.algorithm].color}15` : 'transparent',
                        border: `1px solid ${activeResult === i ? ALGO_META[r.algorithm].color + '60' : 'transparent'}`,
                      }}
                    >
                      {ALGO_META[r.algorithm].label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <GraphVisualizer
              graph={graph}
              results={results}
              selectedAlgo={results?.[activeResult]?.algorithm}
              highlightPath={highlightPath}
              onNodeClick={id => setSourceNode(id)}
            />
          </div>

          {/* Right panel */}
          <div className="flex flex-col gap-4">

            {/* Graph editor */}
            <GraphInputForm
              graph={graph}
              onLoadPreset={loadPreset}
              onAddNode={addNode}
              onAddEdge={addEdge}
              onRemoveNode={removeNode}
              onRemoveEdge={removeEdge}
              onReset={reset}
            />

            {/* Results panel */}
            <div className="glass-panel rounded-xl overflow-hidden flex-1">
              {/* Tabs */}
              <div className="flex" style={{ borderBottom: '1px solid #1a2d50' }}>
                {['results', 'trace', 'heatmap'].map(t => (
                  <button
                    key={t}
                    onClick={() => setRightTab(t)}
                    className={`flex-1 py-2.5 text-xs font-mono uppercase tracking-wider transition-all ${rightTab === t ? 'tab-active' : ''}`}
                    style={{ color: rightTab === t ? '#00e5ff' : '#4a6080' }}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div className="p-4">
                {loading && <LoadingSpinner label="COMPUTING PATHS..." />}
                {error && (
                  <div className="rounded-lg px-3 py-2" style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)' }}>
                    <p className="text-xs font-mono" style={{ color: '#f43f5e' }}>{error}</p>
                  </div>
                )}

                {!loading && rightTab === 'results' && (
                  <div className="space-y-3">
                    {sortedResults.length === 0 && (
                      <p className="text-xs font-mono text-center py-6" style={{ color: '#4a6080' }}>
                        Run an algorithm to see results
                      </p>
                    )}
                    {sortedResults.map((r, i) => (
                      <AlgoResultCard key={r.algorithm} result={r} rank={i} />
                    ))}
                  </div>
                )}

                {!loading && rightTab === 'trace' && (
                  <StepTracer
                    path={currentResult?.path}
                    algorithm={currentResult?.algorithm}
                    graph={graph}
                  />
                )}

                {!loading && rightTab === 'heatmap' && (
                  <div>
                    <p className="text-xs font-mono mb-3" style={{ color: '#4a6080' }}>
                      FLOYD-WARSHALL ALL-PAIRS MATRIX
                    </p>
                    <DistanceHeatmap
                      matrix={fwResult?.distanceMatrix}
                      nodeLabels={graph.nodes.map(n => n.label || String(n.id))}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
