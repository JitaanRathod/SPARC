import React, { useState } from 'react'
import { Plus, Minus, RotateCcw, Download, Upload } from 'lucide-react'

const PRESETS = [
  { key: 'small',    label: 'Small',    desc: '5V · 7E' },
  { key: 'medium',   label: 'Medium',   desc: '10V · 14E' },
  { key: 'negative', label: 'Negative', desc: '5V · 9E · neg' },
]

export default function GraphInputForm({ graph, onLoadPreset, onAddNode, onAddEdge, onRemoveNode, onRemoveEdge, onReset }) {
  const [tab, setTab] = useState('preset')
  const [nodeLabel, setNodeLabel] = useState('')
  const [edge, setEdge] = useState({ source: '', target: '', weight: '1' })
  const [jsonText, setJsonText] = useState('')
  const [jsonError, setJsonError] = useState('')

  const handleAddNode = () => {
    if (!nodeLabel.trim()) return
    onAddNode(nodeLabel.trim().toUpperCase())
    setNodeLabel('')
  }

  const handleAddEdge = () => {
    const { source, target, weight } = edge
    if (source === '' || target === '' || weight === '') return
    onAddEdge({ source, target, weight })
    setEdge({ source: '', target: '', weight: '1' })
  }

  const handleImportJSON = () => {
    try {
      const g = JSON.parse(jsonText)
      if (!g.nodes || !g.edges) throw new Error('Must have nodes[] and edges[]')
      // onImportGraph(g) – wire up if needed
      setJsonError('')
    } catch (e) {
      setJsonError(e.message)
    }
  }

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(graph, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'sparc-graph.json'; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="glass-panel rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid #1a2d50' }}>
        <span className="font-display text-xs tracking-widest" style={{ color: '#00e5ff' }}>GRAPH EDITOR</span>
        <div className="flex gap-2">
          <button onClick={onReset} className="p-1.5 rounded hover:bg-white/5 transition-colors" title="Reset">
            <RotateCcw size={13} color="#4a6080" />
          </button>
          <button onClick={handleExport} className="p-1.5 rounded hover:bg-white/5 transition-colors" title="Export JSON">
            <Download size={13} color="#4a6080" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex" style={{ borderBottom: '1px solid #1a2d50' }}>
        {['preset', 'node', 'edge', 'json'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 text-xs font-mono uppercase tracking-wider transition-all duration-200 ${
              tab === t ? 'tab-active' : ''
            }`}
            style={{ color: tab === t ? '#00e5ff' : '#4a6080' }}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="p-4 space-y-3">
        {/* Preset tab */}
        {tab === 'preset' && (
          <div className="space-y-2">
            <p className="text-xs font-mono mb-3" style={{ color: '#4a6080' }}>Load a sample graph to get started</p>
            {PRESETS.map(p => (
              <button
                key={p.key}
                onClick={() => onLoadPreset(p.key)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 group"
                style={{
                  background: 'rgba(13,21,38,0.8)',
                  border: '1px solid #1a2d50',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(0,229,255,0.3)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#1a2d50'}
              >
                <span className="text-sm font-mono" style={{ color: '#e2ecf8' }}>{p.label}</span>
                <span className="text-xs font-mono" style={{ color: '#4a6080' }}>{p.desc}</span>
              </button>
            ))}
          </div>
        )}

        {/* Node tab */}
        {tab === 'node' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-mono mb-1.5" style={{ color: '#4a6080' }}>NODE LABEL</label>
              <div className="flex gap-2">
                <input
                  value={nodeLabel}
                  onChange={e => setNodeLabel(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddNode()}
                  placeholder="e.g. F"
                  className="input-cyber flex-1 px-3 py-2 rounded-lg text-sm"
                />
                <button onClick={handleAddNode} className="btn-primary px-3 py-2 rounded-lg">
                  <Plus size={14} />
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-mono mb-1.5" style={{ color: '#4a6080' }}>EXISTING NODES</label>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                {graph.nodes.map(n => (
                  <div
                    key={n.id}
                    className="flex items-center gap-1 px-2 py-1 rounded text-xs font-mono group"
                    style={{ background: 'rgba(0,229,255,0.08)', border: '1px solid rgba(0,229,255,0.2)', color: '#00e5ff' }}
                  >
                    {n.label}
                    <button onClick={() => onRemoveNode(n.id)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Minus size={10} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Edge tab */}
        {tab === 'edge' && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: 'source', label: 'SOURCE', placeholder: '0' },
                { key: 'target', label: 'TARGET', placeholder: '1' },
                { key: 'weight', label: 'WEIGHT', placeholder: '1' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-mono mb-1" style={{ color: '#4a6080' }}>{f.label}</label>
                  <input
                    type="number"
                    value={edge[f.key]}
                    onChange={e => setEdge(prev => ({ ...prev, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="input-cyber w-full px-2 py-2 rounded-lg text-sm"
                  />
                </div>
              ))}
            </div>
            <button onClick={handleAddEdge} className="btn-primary w-full py-2 rounded-lg text-sm font-mono flex items-center justify-center gap-2">
              <Plus size={14} /> ADD EDGE
            </button>
            <div>
              <label className="block text-xs font-mono mb-1.5" style={{ color: '#4a6080' }}>EDGES ({graph.edges.length})</label>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {graph.edges.map((e, i) => (
                  <div key={i} className="flex items-center justify-between px-2 py-1 rounded text-xs font-mono group"
                    style={{ background: 'rgba(26,45,80,0.3)' }}>
                    <span style={{ color: '#8ba3c0' }}>
                      {e.source} → {e.target}
                      <span style={{ color: e.weight < 0 ? '#f43f5e' : '#4a6080' }}> [{e.weight}]</span>
                    </span>
                    <button onClick={() => onRemoveEdge(e.source, e.target)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: '#f43f5e' }}>
                      <Minus size={10} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* JSON tab */}
        {tab === 'json' && (
          <div className="space-y-3">
            <textarea
              value={jsonText}
              onChange={e => setJsonText(e.target.value)}
              placeholder={'{\n  "nodes": [{"id":0,"label":"A"}],\n  "edges": [{"source":0,"target":1,"weight":5}],\n  "directed": true\n}'}
              rows={8}
              className="input-cyber w-full px-3 py-2 rounded-lg text-xs resize-none"
            />
            {jsonError && <p className="text-xs font-mono" style={{ color: '#f43f5e' }}>{jsonError}</p>}
            <div className="flex gap-2">
              <button onClick={handleImportJSON} className="btn-primary flex-1 py-2 rounded-lg text-xs font-mono flex items-center justify-center gap-2">
                <Upload size={12} /> IMPORT
              </button>
              <button onClick={handleExport} className="btn-amber flex-1 py-2 rounded-lg text-xs font-mono flex items-center justify-center gap-2">
                <Download size={12} /> EXPORT
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Stats footer */}
      <div className="px-4 py-2 flex justify-between" style={{ borderTop: '1px solid #1a2d50' }}>
        <span className="text-xs font-mono" style={{ color: '#4a6080' }}>V: <span style={{ color: '#8ba3c0' }}>{graph.nodes.length}</span></span>
        <span className="text-xs font-mono" style={{ color: '#4a6080' }}>E: <span style={{ color: '#8ba3c0' }}>{graph.edges.length}</span></span>
        <span className="text-xs font-mono" style={{ color: '#4a6080' }}>
          {graph.directed ? (
            <span style={{ color: '#a855f7' }}>directed</span>
          ) : (
            <span style={{ color: '#00e5ff' }}>undirected</span>
          )}
        </span>
      </div>
    </div>
  )
}
