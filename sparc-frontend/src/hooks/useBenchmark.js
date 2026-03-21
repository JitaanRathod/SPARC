import { useState, useCallback } from 'react'
import { runBenchmark } from '../services/api'
import { MOCK_BENCHMARK } from '../services/mockData'

const USE_MOCK = true

export function useBenchmark() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(MOCK_BENCHMARK)
  const [error, setError] = useState(null)

  const run = useCallback(async (config = {}) => {
    setLoading(true)
    setError(null)
    try {
      let result
      if (USE_MOCK) {
        await new Promise(r => setTimeout(r, 1200 + Math.random() * 800))
        // Simulate slight variance each run
        result = MOCK_BENCHMARK.map(row => ({
          ...row,
          dijkstra: row.dijkstra * (0.9 + Math.random() * 0.2),
          bellmanFord: row.bellmanFord * (0.9 + Math.random() * 0.2),
          floydWarshall: row.floydWarshall * (0.9 + Math.random() * 0.2),
        }))
      } else {
        result = await runBenchmark({
          sizes: [10, 50, 100, 200, 500],
          density: 'SPARSE',
          runs: 5,
          ...config,
        })
      }
      setData(result)
      return result
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  return { loading, data, error, run }
}
