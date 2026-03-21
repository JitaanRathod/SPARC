import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, GitBranch, BarChart2, Zap, Cpu, Activity } from 'lucide-react'
import { ALGO_META } from '../services/mockData'

const FEATURE_CARDS = [
  {
    icon: GitBranch,
    title: 'Graph Visualizer',
    desc: 'Interactive D3-powered graph editor. Add nodes & edges, run algorithms, watch paths animate in real-time.',
    link: '/visualizer',
    color: '#00e5ff',
    tag: 'INTERACTIVE',
  },
  {
    icon: BarChart2,
    title: 'Benchmark Suite',
    desc: 'Compare execution time across datasets. Line & bar charts with log-scale for accurate large-graph comparison.',
    link: '/benchmark',
    color: '#f59e0b',
    tag: 'ANALYTICS',
  },
  {
    icon: Zap,
    title: 'Race Mode',
    desc: 'Side-by-side animated race. Watch all 3 algorithms compete on your graph in real-time progress bars.',
    link: '/race',
    color: '#a855f7',
    tag: 'ANIMATED',
  },
  {
    icon: Cpu,
    title: 'Complexity Reference',
    desc: 'Big-O tables, feature comparison matrix, and estimated runtime growth charts.',
    link: '/complexity',
    color: '#10b981',
    tag: 'REFERENCE',
  },
]

function StatBadge({ label, value, color }) {
  return (
    <div className="glass-panel rounded-lg px-4 py-3 text-center">
      <div className="font-display text-2xl font-bold" style={{ color }}>{value}</div>
      <div className="text-xs font-mono mt-1" style={{ color: '#4a6080' }}>{label}</div>
    </div>
  )
}

export default function Dashboard() {
  const algos = Object.values(ALGO_META)

  return (
    <div className="min-h-screen grid-bg hex-bg pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">

        {/* Hero */}
        <div className="text-center mb-20 fade-up">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 text-xs font-mono"
            style={{ background: 'rgba(0,229,255,0.08)', border: '1px solid rgba(0,229,255,0.2)', color: '#00e5ff' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
            SHORTEST PATH ALGORITHM RESEARCH & COMPARISON
          </div>

          <h1 className="font-display text-6xl md:text-8xl font-black mb-6 leading-none tracking-tight">
            <span
              className="glow-cyan"
              style={{
                background: 'linear-gradient(135deg, #00e5ff 0%, #a855f7 50%, #f59e0b 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              SPARC
            </span>
          </h1>

          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10" style={{ color: '#8ba3c0', lineHeight: 1.7 }}>
            Visualize, compare and benchmark <span style={{ color: '#00e5ff' }}>Dijkstra</span>,{' '}
            <span style={{ color: '#a855f7' }}>Bellman-Ford</span> &{' '}
            <span style={{ color: '#f59e0b' }}>Floyd-Warshall</span> on interactive graphs.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/visualizer"
              className="btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-xl font-mono text-sm"
            >
              <Activity size={16} />
              OPEN VISUALIZER
              <ArrowRight size={14} />
            </Link>
            <Link
              to="/race"
              className="btn-violet inline-flex items-center gap-2 px-6 py-3 rounded-xl font-mono text-sm"
            >
              <Zap size={16} />
              RACE ALGORITHMS
            </Link>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 fade-up fade-up-2">
          <StatBadge label="ALGORITHMS" value="3" color="#00e5ff" />
          <StatBadge label="GRAPH PRESETS" value="3" color="#a855f7" />
          <StatBadge label="BENCHMARK SIZES" value="5" color="#f59e0b" />
          <StatBadge label="VISUALIZER FEATURES" value="7+" color="#10b981" />
        </div>

        {/* Algorithm overview cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
          {algos.map((meta, i) => (
            <div
              key={meta.label}
              className={`glass-panel rounded-xl p-5 fade-up fade-up-${i + 2} group hover:border-opacity-60 transition-all duration-300`}
              style={{ '--border-color': meta.color }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = `${meta.color}60`
                e.currentTarget.style.boxShadow = `0 0 30px ${meta.color}15`
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = ''
                e.currentTarget.style.boxShadow = ''
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <span className="font-display text-base font-bold" style={{ color: meta.color }}>{meta.label}</span>
                <span className="badge" style={{ color: meta.color, border: `1px solid ${meta.colorBorder}`, background: meta.colorDim }}>
                  {meta.javaClass}
                </span>
              </div>
              <p className="text-sm mb-4 leading-relaxed" style={{ color: '#8ba3c0' }}>{meta.description}</p>
              <div className="space-y-2 pt-3" style={{ borderTop: '1px solid #1a2d50' }}>
                <div className="flex justify-between text-xs font-mono">
                  <span style={{ color: '#4a6080' }}>Time</span>
                  <code style={{ color: meta.color }}>{meta.timeComplexity}</code>
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span style={{ color: '#4a6080' }}>Space</span>
                  <code style={{ color: '#8ba3c0' }}>{meta.spaceComplexity}</code>
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span style={{ color: '#4a6080' }}>Neg. weights</span>
                  <span style={{ color: meta.supportsNegative ? '#10b981' : '#f43f5e' }}>
                    {meta.supportsNegative ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Feature cards grid */}
        <h2 className="font-display text-xs tracking-widest mb-6 fade-up fade-up-3" style={{ color: '#4a6080' }}>
          TOOLS & FEATURES
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
          {FEATURE_CARDS.map(({ icon: Icon, title, desc, link, color, tag }, i) => (
            <Link
              key={title}
              to={link}
              className={`glass-panel rounded-xl p-5 flex items-start gap-4 group transition-all duration-300 fade-up fade-up-${i + 2}`}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = `${color}40`
                e.currentTarget.style.boxShadow = `0 0 25px ${color}12`
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = ''
                e.currentTarget.style.boxShadow = ''
              }}
            >
              <div
                className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: `${color}15`, border: `1px solid ${color}30` }}
              >
                <Icon size={18} style={{ color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-display text-sm font-semibold" style={{ color: '#e2ecf8' }}>{title}</span>
                  <span className="badge" style={{ color, border: `1px solid ${color}30`, background: `${color}10` }}>{tag}</span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: '#4a6080' }}>{desc}</p>
              </div>
              <ArrowRight size={14} color="#1a2d50" className="flex-shrink-0 group-hover:translate-x-1 transition-transform" style={{ color }} />
            </Link>
          ))}
        </div>

        {/* Backend note */}
        <div
          className="rounded-xl p-4 flex items-start gap-3 fade-up fade-up-5"
          style={{ background: 'rgba(124,58,237,0.05)', border: '1px solid rgba(124,58,237,0.2)' }}
        >
          <div className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{ background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.4)' }}>
            <span style={{ color: '#a855f7', fontSize: 11 }}>ℹ</span>
          </div>
          <div>
            <p className="text-xs font-mono font-semibold mb-1" style={{ color: '#a855f7' }}>JAVA BACKEND</p>
            <p className="text-xs leading-relaxed" style={{ color: '#4a6080' }}>
              This frontend connects to the Spring Boot backend at <code className="font-mono" style={{ color: '#8ba3c0' }}>localhost:8080</code>.
              Running in <span style={{ color: '#f59e0b' }}>MOCK MODE</span> — all data is simulated.
              Set <code className="font-mono" style={{ color: '#8ba3c0' }}>VITE_USE_MOCK=false</code> in your .env to connect to the live backend.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
