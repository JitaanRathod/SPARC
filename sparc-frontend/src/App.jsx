import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import VisualizerPage from './pages/VisualizerPage'
import BenchmarkPage from './pages/BenchmarkPage'
import RacePage from './pages/RacePage'
import ComplexityPage from './pages/ComplexityPage'
import DocsPage from './pages/DocsPage'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route path="/"           element={<Dashboard />} />
          <Route path="/visualizer" element={<VisualizerPage />} />
          <Route path="/benchmark"  element={<BenchmarkPage />} />
          <Route path="/race"       element={<RacePage />} />
          <Route path="/complexity" element={<ComplexityPage />} />
          <Route path="/docs"       element={<DocsPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}
