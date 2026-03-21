import React from 'react'
import { Cpu } from 'lucide-react'
import ComplexityTable from '../components/ComplexityTable'

export default function ComplexityPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 grid-bg">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-8 fade-up">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)' }}
          >
            <Cpu size={18} color="#10b981" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-wide" style={{ color: '#e2ecf8' }}>
              Complexity Reference
            </h1>
            <p className="text-xs font-mono mt-0.5" style={{ color: '#4a6080' }}>
              Big-O analysis, feature matrix & runtime growth estimates
            </p>
          </div>
        </div>

        <div className="fade-up fade-up-2">
          <ComplexityTable />
        </div>
      </div>
    </div>
  )
}
