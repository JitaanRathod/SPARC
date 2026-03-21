import React, { useState } from 'react'
import { FileText, ChevronRight } from 'lucide-react'

const SECTIONS = [
  {
    id: 'overview',
    title: 'Project Overview',
    color: '#00e5ff',
    content: `SPARC (Shortest Path Algorithm Research & Comparison) is a full-stack application that implements and compares three fundamental shortest-path algorithms: Dijkstra, Bellman-Ford, and Floyd-Warshall.

The backend is written in Java (Spring Boot) and exposes a REST API. The frontend is a React SPA that visualizes graphs, animates paths, and benchmarks performance.`,
  },
  {
    id: 'api',
    title: 'REST API Reference',
    color: '#a855f7',
    content: null,
    isApi: true,
    endpoints: [
      { method: 'POST', path: '/api/run', desc: 'Run a single algorithm on a graph', body: '{ algorithm, graph, source, target? }', response: 'AlgorithmResult' },
      { method: 'POST', path: '/api/compare', desc: 'Run all 3 algorithms and compare', body: '{ graph, source }', response: 'CompareResult[]' },
      { method: 'POST', path: '/api/benchmark', desc: 'Benchmark across dataset sizes', body: '{ sizes[], density, runs }', response: 'BenchmarkResult[]' },
      { method: 'GET',  path: '/api/graphs/:preset', desc: 'Load a preset graph', body: '—', response: 'GraphPayload' },
      { method: 'GET',  path: '/api/graphs', desc: 'List all preset names', body: '—', response: 'string[]' },
      { method: 'GET',  path: '/api/health', desc: 'Health check', body: '—', response: '{ status: "UP" }' },
    ],
  },
  {
    id: 'graph-format',
    title: 'Graph Payload Format',
    color: '#f59e0b',
    content: null,
    isCode: true,
    code: `// GraphPayload
{
  "nodes": [
    { "id": 0, "label": "A" },
    { "id": 1, "label": "B" }
  ],
  "edges": [
    { "source": 0, "target": 1, "weight": 5 },
    { "source": 1, "target": 0, "weight": -2 }  // negative ok for BF/FW
  ],
  "directed": true
}

// AlgorithmResult
{
  "algorithm": "DIJKSTRA",
  "distances": { "0": 0, "1": 5, "2": 8 },
  "path": [0, 1, 2],
  "executionTimeMs": 1.24,
  "nodesVisited": 3,
  "relaxations": 7,
  "negativeCycleDetected": false
}`,
  },
  {
    id: 'setup',
    title: 'Setup & Running',
    color: '#10b981',
    content: null,
    isCode: true,
    code: `# Backend (Java Spring Boot)
cd backend
mvn spring-boot:run
# API available at http://localhost:8080

# Frontend (React + Vite)
cd sparc-frontend
npm install
npm run dev
# UI available at http://localhost:3000

# Environment variables
# sparc-frontend/.env
VITE_USE_MOCK=false   # set true to use mock data without backend
VITE_API_BASE=http://localhost:8080  # override if backend is on different host`,
  },
  {
    id: 'algorithms',
    title: 'Algorithm Notes',
    color: '#8ba3c0',
    content: `Dijkstra's Algorithm uses a greedy approach with a priority queue (min-heap). It processes each vertex exactly once and is optimal for non-negative weighted graphs. The Java implementation in Dijkstra.java uses PriorityQueue<int[]> for O((V+E)logV) time.

Bellman-Ford relaxes all edges V-1 times. It is slower but handles negative edge weights and detects negative cycles (an extra pass where any relaxation occurs indicates a negative cycle). See BellmanFord.java.

Floyd-Warshall uses dynamic programming to find shortest paths between all pairs of vertices simultaneously. The distance matrix dp[i][j] represents the shortest distance from i to j. See FloydWarshall.java. Not suitable for graphs with V > ~500 due to O(V³) time.`,
  },
]

const METHOD_COLORS = { GET: '#10b981', POST: '#00e5ff', PUT: '#f59e0b', DELETE: '#f43f5e' }

export default function DocsPage() {
  const [active, setActive] = useState('overview')

  const section = SECTIONS.find(s => s.id === active)

  return (
    <div className="min-h-screen pt-24 pb-16 grid-bg">
      <div className="max-w-6xl mx-auto px-6">

        <div className="flex items-center gap-3 mb-8 fade-up">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(139,163,192,0.1)', border: '1px solid rgba(139,163,192,0.2)' }}>
            <FileText size={18} color="#8ba3c0" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold" style={{ color: '#e2ecf8' }}>Documentation</h1>
            <p className="text-xs font-mono mt-0.5" style={{ color: '#4a6080' }}>API reference, setup guide, algorithm notes</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6">
          {/* Sidebar */}
          <div className="space-y-1">
            {SECTIONS.map(s => (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-mono text-left transition-all duration-200"
                style={{
                  background: active === s.id ? `${s.color}12` : 'transparent',
                  border: `1px solid ${active === s.id ? s.color + '40' : 'transparent'}`,
                  color: active === s.id ? s.color : '#4a6080',
                }}
              >
                {s.title}
                {active === s.id && <ChevronRight size={12} />}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="glass-panel rounded-xl p-6 fade-up fade-up-2">
            <h2 className="font-display text-lg font-bold mb-4" style={{ color: section.color }}>{section.title}</h2>

            {section.content && (
              <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: '#8ba3c0' }}>
                {section.content}
              </p>
            )}

            {section.isApi && (
              <div className="space-y-3">
                {section.endpoints.map((ep, i) => (
                  <div key={i} className="rounded-lg overflow-hidden" style={{ border: '1px solid #1a2d50' }}>
                    <div className="flex items-center gap-3 px-4 py-2.5"
                      style={{ background: 'rgba(13,21,38,0.8)', borderBottom: '1px solid #1a2d50' }}>
                      <span
                        className="badge font-bold"
                        style={{ color: METHOD_COLORS[ep.method], background: `${METHOD_COLORS[ep.method]}15`, border: `1px solid ${METHOD_COLORS[ep.method]}30` }}
                      >
                        {ep.method}
                      </span>
                      <code className="text-sm font-mono" style={{ color: '#e2ecf8' }}>{ep.path}</code>
                      <span className="ml-auto text-xs" style={{ color: '#4a6080' }}>{ep.desc}</span>
                    </div>
                    <div className="flex gap-6 px-4 py-2.5 text-xs font-mono">
                      <div>
                        <span style={{ color: '#4a6080' }}>Body: </span>
                        <code style={{ color: '#8ba3c0' }}>{ep.body}</code>
                      </div>
                      <div>
                        <span style={{ color: '#4a6080' }}>Response: </span>
                        <code style={{ color: section.color }}>{ep.response}</code>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {section.isCode && (
              <pre
                className="rounded-xl p-4 text-xs font-mono overflow-x-auto leading-relaxed"
                style={{ background: 'rgba(9,14,26,0.9)', border: '1px solid #1a2d50', color: '#8ba3c0' }}
              >
                <code>{section.code}</code>
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
