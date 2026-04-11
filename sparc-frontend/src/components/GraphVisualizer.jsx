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
  const containerRef = useRef(null)

  // Resize observer safely updates only if changed
  useEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect
      setDimensions(prev => {
        const newH = Math.max(height, 400)
        return (prev.w === width && prev.h === newH) ? prev : { w: width, h: newH }
      })
    })
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  // D3 simulation
  useEffect(() => {
    try {
      if (!svgRef.current || !graph) return

    // Derive animated edges directly, avoiding extra react state
    const animatedEdges = new Set()
    if (highlightPath && highlightPath.length) {
      for (let i = 0; i < highlightPath.length - 1; i++) {
        animatedEdges.add(`${highlightPath[i]}-${highlightPath[i + 1]}`)
      }
    }

    // Force constraints so nodes don't spawn off-screen if height is ridiculous
    const w = Math.max(dimensions.w, 100);
    const h = Math.min(Math.max(dimensions.h, 100), 1000); 

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    // Defs
    const defs = svg.append('defs')

    // 3D Drop Shadow
    const shadow = defs.append('filter').attr('id', 'drop-shadow')
      .attr('x', '-20%').attr('y', '-20%').attr('width', '150%').attr('height', '150%')
    shadow.append('feDropShadow').attr('dx', 2).attr('dy', 4).attr('stdDeviation', 4).attr('flood-color', '#000000').attr('flood-opacity', 0.6)

    // 3D Sphere Gradients for nodes
    const colors = {
      default: ['#1e3a8a', '#0f172a'],
      source: ['#00e5ff', '#007080'],
      target: ['#10b981', '#064e3b'],
      path: ['#a855f7', '#4c1d95']
    }
    Object.entries(colors).forEach(([name, [stop1, stop2]]) => {
      const grad = defs.append('radialGradient').attr('id', `grad-${name}`)
        .attr('cx', '30%').attr('cy', '30%').attr('r', '70%')
      grad.append('stop').attr('offset', '0%').attr('stop-color', stop1)
      grad.append('stop').attr('offset', '100%').attr('stop-color', stop2)
    })

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
        .attr('refX', Math.max(26, 26)) // Guaranteed outside the 16px radius
        .attr('refY', 0)
        .attr('markerWidth', 7)
        .attr('markerHeight', 7)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M0,-5L10,0L0,5')
        .attr('fill', markerColors[key])
        .attr('opacity', key === 'default' ? 0.7 : 1)
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

    // Draw edges as PATHS to allow curving (prevents hiding overlapping bidirectional arrows)
    const link = edgeLayer.selectAll('g.edge')
      .data(edges)
      .enter().append('g').attr('class', 'edge')

    const edgeLine = link.append('path')
      .attr('fill', 'none')
      .attr('stroke', d => {
        const key = `${d.source.id ?? d.source}-${d.target.id ?? d.target}`
        return animatedEdges.has(key) ? accentColor : '#1e3a8a'
      })
      .attr('stroke-width', d => {
        const key = `${d.source.id ?? d.source}-${d.target.id ?? d.target}`
        return animatedEdges.has(key) ? 3 : 1.5
      })
      .attr('stroke-opacity', d => {
        const key = `${d.source.id ?? d.source}-${d.target.id ?? d.target}`
        return animatedEdges.has(key) ? 1 : 0.6
      })
      .attr('filter', d => {
        const key = `${d.source.id ?? d.source}-${d.target.id ?? d.target}`
        return animatedEdges.has(key) ? 'url(#glow-cyan)' : 'url(#drop-shadow)'
      })
      .attr('marker-end', graph.directed ? d => {
        const key = `${d.source.id ?? d.source}-${d.target.id ?? d.target}`
        return `url(#arrow-${animatedEdges.has(key) ? 'path' : 'default'})`
      } : null)

    // Edge weight labels with background for readability
    const labelGroup = link.append('g')
    labelGroup.append('rect')
      .attr('fill', '#0f172a').attr('rx', 4).attr('opacity', 0.8)
      .attr('x', -8).attr('y', -8).attr('width', 16).attr('height', 16)
    
    labelGroup.append('text')
      .attr('fill', '#e2ecf8')
      .attr('font-size', 10)
      .attr('font-weight', 'bold')
      .attr('font-family', 'JetBrains Mono')
      .attr('text-anchor', 'middle')
      .attr('dy', 3)
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

    // Node 3D Sphere
    node.append('circle')
      .attr('r', 16)
      .attr('fill', d => {
        if (d.id === highlightPath[0]) return 'url(#grad-source)'
        if (d.id === highlightPath[highlightPath.length - 1]) return 'url(#grad-target)'
        if (highlightPath.includes(d.id)) return 'url(#grad-path)'
        return 'url(#grad-default)'
      })
      .attr('stroke', d => {
        if (d.id === highlightPath[0]) return '#00e5ff'
        if (d.id === highlightPath[highlightPath.length - 1]) return '#10b981'
        if (highlightPath.includes(d.id)) return accentColor
        return '#3b82f6'
      })
      .attr('stroke-width', d => highlightPath.includes(d.id) ? 2.5 : 1.5)
      .attr('filter', d => highlightPath.includes(d.id) ? 'url(#glow-cyan)' : 'url(#drop-shadow)')

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
      edgeLine.attr('d', d => {
        const dx = d.target.x - d.source.x, dy = d.target.y - d.source.y;
        const dr = Math.sqrt(dx * dx + dy * dy) * 1.5; // Curve radius
        // Force straight lines if undirected, curved if directed to show arrows clearly
        return graph.directed 
          ? `M${d.source.x},${d.source.y}A${dr},${dr} 0 0,1 ${d.target.x},${d.target.y}`
          : `M${d.source.x},${d.source.y}L${d.target.x},${d.target.y}`
      })

      // Update completely precise label positions for curved paths
      labelGroup.attr('transform', d => {
        const dx = d.target.x - d.source.x, dy = d.target.y - d.source.y;
        const cx = (d.source.x + d.target.x) / 2;
        const cy = (d.source.y + d.target.y) / 2;
        if (graph.directed) {
          // Offset text along the curve perpendicular normal
          const dist = Math.sqrt(dx * dx + dy * dy);
          const nx = -dy / dist; const ny = dx / dist;
          return `translate(${cx + nx * 15}, ${cy + ny * 15})`
        }
        return `translate(${cx}, ${cy})`
      })

      node.attr('transform', d => `translate(${d.x},${d.y})`)
    })

    // Debug print
    svg.append('text').attr('x', 20).attr('y', 15).attr('fill', '#10b981')
      .attr('font-size', '11px').attr('font-family', 'monospace')
      .text(`D3 Active: ${nodes.length} nodes, ${edges.length} edges. w=${w}, h=${h}`);

    return () => sim.stop()
    } catch (err) {
      console.error(err)
      d3.select(svgRef.current).selectAll('*').remove()
      d3.select(svgRef.current).append('text')
        .attr('x', 20).attr('y', 30)
        .attr('fill', '#f43f5e').attr('font-family', 'monospace')
        .text(`D3 Error: ${err.message}`)
      d3.select(svgRef.current).append('text')
        .attr('x', 20).attr('y', 50)
        .attr('fill', '#f43f5e').attr('font-size', '10px')
        .text(err.stack?.substring(0, 150))
    }
  }, [graph, results, selectedAlgo, highlightPath ? highlightPath.join(',') : '', dimensions.w, dimensions.h])

  return (
    <div ref={containerRef} className="w-full h-full relative" style={{ minHeight: 400 }}>
      <div className="absolute inset-0">
        <svg
          ref={svgRef}
          width={dimensions.w}
          height={dimensions.h}
          className="w-full h-full block"
          style={{ background: 'transparent' }}
        />
      </div>
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
