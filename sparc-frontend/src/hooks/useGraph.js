import { useState, useCallback } from 'react'
import { MOCK_GRAPHS } from '../services/mockData'
import { getPresetGraph } from '../services/api'

const USE_MOCK = false

export function useGraph(initial = 'small') {
  const [graph, setGraph] = useState(MOCK_GRAPHS[initial])
  const [presetName, setPresetName] = useState(initial)
  const [loading, setLoading] = useState(false)

  const loadPreset = useCallback(async (name) => {
    setLoading(true)
    try {
      let g
      if (USE_MOCK || !MOCK_GRAPHS[name]) {
        g = MOCK_GRAPHS[name] || MOCK_GRAPHS.small
      } else {
        g = await getPresetGraph(name)
      }
      setGraph(g)
      setPresetName(name)
      return g
    } finally {
      setLoading(false)
    }
  }, [])

  const addNode = useCallback((label) => {
    setGraph(prev => ({
      ...prev,
      nodes: [...prev.nodes, { id: prev.nodes.length, label: label || String(prev.nodes.length) }],
    }))
  }, [])

  const addEdge = useCallback(({ source, target, weight }) => {
    setGraph(prev => ({
      ...prev,
      edges: [...prev.edges, { source: Number(source), target: Number(target), weight: Number(weight) }],
    }))
  }, [])

  const removeNode = useCallback((id) => {
    setGraph(prev => ({
      nodes: prev.nodes.filter(n => n.id !== id),
      edges: prev.edges.filter(e => e.source !== id && e.target !== id),
      directed: prev.directed,
    }))
  }, [])

  const removeEdge = useCallback((source, target) => {
    setGraph(prev => ({
      ...prev,
      edges: prev.edges.filter(e => !(e.source === source && e.target === target)),
    }))
  }, [])

  const reset = useCallback(() => {
    setGraph(MOCK_GRAPHS[presetName] || MOCK_GRAPHS.small)
  }, [presetName])

  const generateGraph = useCallback((numNodes) => {
    const nodes = Array.from({ length: numNodes }, (_, i) => ({ id: i, label: String(i) }))
    const edges = []
    for (let i = 0; i < numNodes; i++) {
        const numEdges = Math.max(1, Math.floor(Math.random() * 3))
        for (let j = 0; j < numEdges; j++) {
            let target = Math.floor(Math.random() * numNodes);
            if (target === i) target = (target + 1) % numNodes;
            const weight = Math.floor(Math.random() * 100) + 1;
            edges.push({ source: i, target, weight });
        }
    }
    setGraph({ nodes, edges, directed: true })
    setPresetName('custom')
  }, [])

  return { graph, setGraph, presetName, loading, loadPreset, addNode, addEdge, removeNode, removeEdge, reset, generateGraph }
}
