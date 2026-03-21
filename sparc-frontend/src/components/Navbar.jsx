import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { Activity, GitBranch, BarChart2, Cpu, FileText, Zap } from 'lucide-react'

const NAV_ITEMS = [
  { path: '/',           label: 'Dashboard',   icon: Activity },
  { path: '/visualizer', label: 'Visualizer',  icon: GitBranch },
  { path: '/benchmark',  label: 'Benchmark',   icon: BarChart2 },
  { path: '/race',       label: 'Race Mode',   icon: Zap },
  { path: '/complexity', label: 'Complexity',  icon: Cpu },
  { path: '/docs',       label: 'Docs',        icon: FileText },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'py-2' : 'py-4'
      }`}
      style={{
        background: scrolled
          ? 'rgba(5,8,18,0.95)'
          : 'linear-gradient(180deg, rgba(5,8,18,0.9) 0%, transparent 100%)',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(26,45,80,0.8)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-display font-bold"
              style={{
                background: 'linear-gradient(135deg, rgba(0,229,255,0.2), rgba(124,58,237,0.2))',
                border: '1px solid rgba(0,229,255,0.4)',
                color: '#00e5ff',
                boxShadow: '0 0 15px rgba(0,229,255,0.2)',
              }}
            >
              ⬡
            </div>
            <div
              className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ boxShadow: '0 0 20px rgba(0,229,255,0.4)' }}
            />
          </div>
          <div>
            <div
              className="font-display font-bold text-lg leading-none tracking-wider"
              style={{ color: '#00e5ff', textShadow: '0 0 20px rgba(0,229,255,0.4)' }}
            >
              SPARC
            </div>
            <div className="text-xs font-mono" style={{ color: '#4a6080', letterSpacing: '0.12em' }}>
              PATH RESEARCH
            </div>
          </div>
        </NavLink>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-body transition-all duration-200 ${
                  isActive
                    ? 'text-cyan-DEFAULT'
                    : 'text-ghost hover:text-snow'
                }`
              }
              style={({ isActive }) => isActive ? {
                background: 'rgba(0,229,255,0.08)',
                border: '1px solid rgba(0,229,255,0.2)',
                textShadow: '0 0 10px rgba(0,229,255,0.5)',
              } : {
                border: '1px solid transparent',
              }}
            >
              <Icon size={14} />
              {label}
            </NavLink>
          ))}
        </div>

        {/* Status indicator */}
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full"
          style={{
            background: 'rgba(16,185,129,0.1)',
            border: '1px solid rgba(16,185,129,0.3)',
          }}
        >
          <div
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: '#10b981', boxShadow: '0 0 6px #10b981' }}
          />
          <span className="text-xs font-mono" style={{ color: '#10b981' }}>ONLINE</span>
        </div>
      </div>
    </nav>
  )
}
