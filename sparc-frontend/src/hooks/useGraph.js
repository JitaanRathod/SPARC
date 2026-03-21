import { useState, useCallback } from 'react'
import { MOCK_GRAPHS } from '../services/mockData'
import { getPresetGraph } from '../services/api'

const USE_MOCK = true

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

  return { graph, setGraph, presetName, loading, loadPreset, addNode, addEdge, removeNode, removeEdge, reset }
}
