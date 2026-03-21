import axios from 'axios'

const BASE = '/api'

const api = axios.create({
  baseURL: BASE,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

// ─── Request interceptor ───────────────────────────────────────────────────
api.interceptors.request.use(config => {
  console.log(`[SPARC API] ${config.method?.toUpperCase()} ${config.url}`)
  return config
})

// ─── Response interceptor ─────────────────────────────────────────────────
api.interceptors.response.use(
  res => res.data,
  err => {
    const msg = err.response?.data?.message || err.message || 'Unknown error'
    console.error('[SPARC API Error]', msg)
    return Promise.reject(new Error(msg))
  }
)

// ─── Endpoints ────────────────────────────────────────────────────────────

/**
 * Run a single algorithm on a graph.
 * POST /api/run
 * Body: { algorithm: 'DIJKSTRA'|'BELLMAN_FORD'|'FLOYD_WARSHALL', graph: GraphPayload, source: number, target?: number }
 * Response: AlgorithmResult
 */
export const runAlgorithm = (payload) => api.post('/run', payload)

/**
 * Run all 3 algorithms and compare.
 * POST /api/compare
 * Body: { graph: GraphPayload, source: number }
 * Response: CompareResult[]
 */
export const compareAll = (payload) => api.post('/compare', payload)

/**
 * Benchmark algorithms across multiple dataset sizes.
 * POST /api/benchmark
 * Body: { sizes: number[], density: 'SPARSE'|'DENSE', runs: number }
 * Response: BenchmarkResult[]
 */
export const runBenchmark = (payload) => api.post('/benchmark', payload)

/**
 * Get preset graphs by name.
 * GET /api/graphs/:preset
 * preset: 'small' | 'medium' | 'large' | 'negative' | 'dense'
 */
export const getPresetGraph = (preset) => api.get(`/graphs/${preset}`)

/**
 * Get all available preset names.
 * GET /api/graphs
 */
export const listPresets = () => api.get('/graphs')

/**
 * Health check.
 * GET /api/health
 */
export const healthCheck = () => api.get('/health')

export default api
