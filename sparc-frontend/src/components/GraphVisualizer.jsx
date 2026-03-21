import React, { useEffect, useRef, useState, useCallback } from 'react'
import * as d3 from 'd3'

const ALGO_COLORS = {
  DIJKSTRA: '#00e5ff',
  BELLMAN_FORD: '#a855f7',
  FLOYD_WARSHALL: '#f59e0b',
}

export default function GraphVisualizer({ graph, results, selectedAlgo, onNodeClick, highlightPath = [] }) {
  const svgRef = useRef(null)
  const simRef = useRef(null)
  const [dimensions, setDimensions] = useState({ w: 800, h: 500 })
  const [animatedEdges, setAnimatedEdges] = useState(new Set())
  const containerRef = useRef(null)

  // Resize observer
  useEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect
      setDimensions({ w: width, h: Math.max(height, 400) })
    })
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  // Animate path edges when results change
  useEffect(() => {
    if (!highlightPath.length) { setAnimatedEdges(new Set()); return }
    const set = new Set()
    for (let i = 0; i < highlightPath.length - 1; i++) {
      set.add(`${highlightPath[i]}-${highlightPath[i + 1]}`)
    }
    setAnimatedEdges(set)
  }, [highlightPath])

  // D3 simulation
  useEffect(() => {
    if (!svgRef.current || !graph) return
    const { w, h } = dimensions
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    // Defs
    const defs = svg.append('defs')

    // Glow filter
    ;['cyan', 'violet', 'amber', 'node'].forEach((name, i) => {
      const colors = ['#00e5ff', '#a855f7', '#f59e0b', '#00e5ff']
      const f = defs.append('filter').attr('id', `glow-${name}`)
      f.append('feGaussianBlur').attr('stdDeviation', 3).attr('result', 'blur')
      f.append('feMerge').selectAll('feMergeNode').data(['blur', 'SourceGraphic'])
        .enter().append('feMergeNode').attr('in', d => d)
    })

    // Arrow markers
    const algoKeys = ['DIJKSTRA', 'BELLMAN_FORD', 'FLOYD_WARSHALL', 'default', 'path']
    const markerColors = { DIJKSTRA: '#00e5ff', BELLMAN_FORD: '#a855f7', FLOYD_WARSHALL: '#f59e0b', default: '#1a2d50', path: '#00e5ff' }

    algoKeys.forEach(key => {
      defs.append('marker')
        .attr('id', `arrow-${key}`)
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 22)
        .attr('refY', 0)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M0,-5L10,0L0,5')
        .attr('fill', markerColors[key])
        .attr('opacity', key === 'default' ? 0.4 : 0.9)
    })

    // Copy nodes/edges with positions
    const nodes = graph.nodes.map(n => ({ ...n, x: w / 2 + (Math.random() - 0.5) * 200, y: h / 2 + (Math.random() - 0.5) * 200 }))
    const edges = graph.edges.map(e => ({ ...e }))
    const nodeById = Object.fromEntries(nodes.map(n => [n.id, n]))

    // Layers
    const edgeLayer = svg.append('g').attr('class', 'edges')
    const nodeLayer = svg.append('g').attr('class', 'nodes')

    // Simulation
    const sim = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(edges).id(d => d.id).distance(90).strength(0.8))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(w / 2, h / 2))
      .force('collision', d3.forceCollide(30))

    simRef.current = sim

    const accentColor = selectedAlgo ? ALGO_COLORS[selectedAlgo] : '#00e5ff'

    // Draw edges
    const link = edgeLayer.selectAll('g.edge')
      .data(edges)
      .enter().append('g').attr('class', 'edge')

    const edgeLine = link.append('line')
      .attr('stroke', d => {
        const key = `${d.source.id ?? d.source}-${d.target.id ?? d.target}`
        return animatedEdges.has(key) ? accentColor : '#1a2d50'
      })
      .attr('stroke-width', d => {
        const key = `${d.source.id ?? d.source}-${d.target.id ?? d.target}`
        return animatedEdges.has(key) ? 2.5 : 1
      })
      .attr('stroke-opacity', d => {
        const key = `${d.source.id ?? d.source}-${d.target.id ?? d.target}`
        return animatedEdges.has(key) ? 1 : 0.35
      })
      .attr('filter', d => {
        const key = `${d.source.id ?? d.source}-${d.target.id ?? d.target}`
        return animatedEdges.has(key) ? 'url(#glow-cyan)' : null
      })
      .attr('marker-end', graph.directed ? d => {
        const key = `${d.source.id ?? d.source}-${d.target.id ?? d.target}`
        return `url(#arrow-${animatedEdges.has(key) ? 'path' : 'default'})`
      } : null)

    // Edge weight labels
    link.append('text')
      .attr('fill', '#4a6080')
      .attr('font-size', 10)
      .attr('font-family', 'JetBrains Mono')
      .attr('text-anchor', 'middle')
      .attr('dy', -4)
      .text(d => d.weight)

    // Draw nodes
    const node = nodeLayer.selectAll('g.node')
      .data(nodes)
      .enter().append('g')
      .attr('class', 'node')
      .style('cursor', 'pointer')
      .call(d3.drag()
        .on('start', (event, d) => {
          if (!event.active) sim.alphaTarget(0.3).restart()
          d.fx = d.x; d.fy = d.y
        })
        .on('drag', (event, d) => { d.fx = event.x; d.fy = event.y })
        .on('end', (event, d) => {
          if (!event.active) sim.alphaTarget(0)
          d.fx = null; d.fy = null
        })
      )
      .on('click', (event, d) => onNodeClick?.(d.id))

    // Node outer ring (glow)
    node.append('circle')
      .attr('r', 18)
      .attr('fill', 'none')
      .attr('stroke', d => highlightPath.includes(d.id) ? accentColor : 'transparent')
      .attr('stroke-width', 1)
      .attr('opacity', 0.4)
      .attr('filter', 'url(#glow-cyan)')
      .attr('class', d => highlightPath.includes(d.id) ? 'animate-ping' : '')

    // Node circle
    node.append('circle')
      .attr('r', 14)
      .attr('fill', d => {
        if (d.id === highlightPath[0]) return 'rgba(0,229,255,0.25)'
        if (d.id === highlightPath[highlightPath.length - 1]) return 'rgba(16,185,129,0.25)'
        if (highlightPath.includes(d.id)) return 'rgba(0,229,255,0.12)'
        return 'rgba(13,21,38,0.9)'
      })
      .attr('stroke', d => {
        if (d.id === highlightPath[0]) return '#00e5ff'
        if (d.id === highlightPath[highlightPath.length - 1]) return '#10b981'
        if (highlightPath.includes(d.id)) return accentColor
        return '#243d6a'
      })
      .attr('stroke-width', d => highlightPath.includes(d.id) ? 2 : 1.5)
      .attr('filter', d => highlightPath.includes(d.id) ? 'url(#glow-cyan)' : null)

    // Node label
    node.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('fill', d => highlightPath.includes(d.id) ? '#ffffff' : '#8ba3c0')
      .attr('font-size', 11)
      .attr('font-family', 'JetBrains Mono')
      .attr('font-weight', '500')
      .text(d => d.label || d.id)

    // Distance label (from results)
    if (results && results[0]?.distances) {
      const dists = results[0].distances
      node.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', 28)
        .attr('fill', '#00e5ff')
        .attr('font-size', 9)
        .attr('font-family', 'JetBrains Mono')
        .attr('opacity', 0.7)
        .text(d => dists[d.id] !== undefined && dists[d.id] !== Infinity ? `d:${dists[d.id]}` : '')
    }

    // Tick
    sim.on('tick', () => {
      edgeLine
        .attr('x1', d => d.source.x).attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x).attr('y2', d => d.target.y)

      link.select('text')
        .attr('x', d => (d.source.x + d.target.x) / 2)
        .attr('y', d => (d.source.y + d.target.y) / 2)

      node.attr('transform', d => `translate(${d.x},${d.y})`)
    })

    return () => sim.stop()
  }, [graph, results, selectedAlgo, highlightPath, dimensions, animatedEdges])

  return (
    <div ref={containerRef} className="w-full h-full relative" style={{ minHeight: 400 }}>
      <svg
        ref={svgRef}
        width={dimensions.w}
        height={dimensions.h}
        className="w-full h-full"
        style={{ background: 'transparent' }}
      />
      {/* Legend */}
      <div className="absolute bottom-3 left-3 flex items-center gap-3 text-xs font-mono" style={{ color: '#4a6080' }}>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full" style={{ background: '#00e5ff', opacity: 0.8 }} />
          <span>Source</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full" style={{ background: '#10b981', opacity: 0.8 }} />
          <span>Target</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-8 h-0.5" style={{ background: '#00e5ff' }} />
          <span>Path</span>
        </div>
      </div>
      {/* Drag hint */}
      <div className="absolute top-3 right-3 text-xs font-mono" style={{ color: '#4a6080' }}>
        drag nodes · click to select
      </div>
    </div>
  )
}
