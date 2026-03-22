import { useState, useCallback } from 'react'
import { compareAll, runAlgorithm } from '../services/api'
import { MOCK_COMPARE_RESULT, MOCK_GRAPHS } from '../services/mockData'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || false // backend is live

export function useAlgorithm() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)

  const run = useCallback(async ({ graph, source, target, algorithm }) => {
    setLoading(true)
    setError(null)
    try {
      let data
      if (USE_MOCK) {
        await new Promise(r => setTimeout(r, 800 + Math.random() * 600))
        data = algorithm
          ? [MOCK_COMPARE_RESULT(source).find(r => r.algorithm === algorithm)]
          : MOCK_COMPARE_RESULT(source)
      } else {
        data = algorithm
          ? [await runAlgorithm({ algorithm, graph, source, target })]
          : await compareAll({ graph, source })
      }
      setResults(data)
      return data
    } catch (e) {
      setError(e.message)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return { loading, results, error, run, setResults }
}
