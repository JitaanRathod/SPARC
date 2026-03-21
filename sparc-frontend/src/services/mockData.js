// ─── Mock data used when backend is unavailable ───────────────────────────

export const MOCK_GRAPHS = {
  small: {
    nodes: [
      { id: 0, label: 'A' }, { id: 1, label: 'B' },
      { id: 2, label: 'C' }, { id: 3, label: 'D' },
      { id: 4, label: 'E' },
    ],
    edges: [
      { source: 0, target: 1, weight: 4 },
      { source: 0, target: 2, weight: 2 },
      { source: 1, target: 3, weight: 5 },
      { source: 2, target: 1, weight: 1 },
      { source: 2, target: 3, weight: 8 },
      { source: 2, target: 4, weight: 10 },
      { source: 3, target: 4, weight: 2 },
    ],
    directed: true,
  },
  medium: {
    nodes: Array.from({ length: 10 }, (_, i) => ({ id: i, label: String.fromCharCode(65 + i) })),
    edges: [
      { source: 0, target: 1, weight: 3 }, { source: 0, target: 3, weight: 7 },
      { source: 1, target: 2, weight: 2 }, { source: 1, target: 4, weight: 5 },
      { source: 2, target: 5, weight: 4 }, { source: 3, target: 4, weight: 2 },
      { source: 3, target: 6, weight: 6 }, { source: 4, target: 5, weight: 1 },
      { source: 4, target: 7, weight: 3 }, { source: 5, target: 8, weight: 5 },
      { source: 6, target: 7, weight: 4 }, { source: 7, target: 8, weight: 2 },
      { source: 7, target: 9, weight: 6 }, { source: 8, target: 9, weight: 1 },
    ],
    directed: false,
  },
  negative: {
    nodes: [
      { id: 0, label: 'S' }, { id: 1, label: 'A' },
      { id: 2, label: 'B' }, { id: 3, label: 'C' }, { id: 4, label: 'T' },
    ],
    edges: [
      { source: 0, target: 1, weight: 6 },
      { source: 0, target: 2, weight: 7 },
      { source: 1, target: 2, weight: 8 },
      { source: 1, target: 3, weight: -4 },
      { source: 1, target: 4, weight: 5 },
      { source: 2, target: 3, weight: 9 },
      { source: 2, target: 4, weight: -3 },
      { source: 3, target: 0, weight: 2 },
      { source: 4, target: 3, weight: 7 },
    ],
    directed: true,
  },
}

export const MOCK_COMPARE_RESULT = (source = 0) => [
  {
    algorithm: 'DIJKSTRA',
    distances: { 0: 0, 1: 3, 2: 2, 3: 8, 4: 10 },
    path: [0, 2, 1, 3, 4],
    executionTimeMs: 1.24,
    nodesVisited: 5,
    relaxations: 7,
  },
  {
    algorithm: 'BELLMAN_FORD',
    distances: { 0: 0, 1: 3, 2: 2, 3: 8, 4: 10 },
    path: [0, 2, 1, 3, 4],
    executionTimeMs: 3.87,
    nodesVisited: 5,
    relaxations: 28,
    negativeCycleDetected: false,
  },
  {
    algorithm: 'FLOYD_WARSHALL',
    distanceMatrix: [
      [0, 3, 2, 8, 10],
      [Infinity, 0, Infinity, 5, 7],
      [Infinity, 1, 0, 6, 8],
      [Infinity, Infinity, Infinity, 0, 2],
      [Infinity, Infinity, Infinity, Infinity, 0],
    ],
    executionTimeMs: 0.92,
    nodesVisited: 5,
    relaxations: 125,
  },
]

export const MOCK_BENCHMARK = [
  { size: 10,  dijkstra: 0.3,  bellmanFord: 0.9,  floydWarshall: 0.2  },
  { size: 50,  dijkstra: 1.2,  bellmanFord: 4.1,  floydWarshall: 3.8  },
  { size: 100, dijkstra: 3.4,  bellmanFord: 14.2, floydWarshall: 28.1 },
  { size: 200, dijkstra: 8.7,  bellmanFord: 52.3, floydWarshall: 220  },
  { size: 500, dijkstra: 28.1, bellmanFord: 312,  floydWarshall: 3410 },
]

export const ALGO_META = {
  DIJKSTRA: {
    label: 'Dijkstra',
    color: '#00e5ff',
    colorDim: 'rgba(0,229,255,0.15)',
    colorBorder: 'rgba(0,229,255,0.4)',
    timeComplexity: 'O((V + E) log V)',
    spaceComplexity: 'O(V)',
    supportsNegative: false,
    allPairs: false,
    description: 'Greedy algorithm using a priority queue. Optimal for non-negative weighted graphs.',
    javaClass: 'Dijkstra.java',
  },
  BELLMAN_FORD: {
    label: 'Bellman-Ford',
    color: '#a855f7',
    colorDim: 'rgba(168,85,247,0.15)',
    colorBorder: 'rgba(168,85,247,0.4)',
    timeComplexity: 'O(V × E)',
    spaceComplexity: 'O(V)',
    supportsNegative: true,
    allPairs: false,
    description: 'Dynamic programming approach. Handles negative edges & detects negative cycles.',
    javaClass: 'BellmanFord.java',
  },
  FLOYD_WARSHALL: {
    label: 'Floyd-Warshall',
    color: '#f59e0b',
    colorDim: 'rgba(245,158,11,0.15)',
    colorBorder: 'rgba(245,158,11,0.4)',
    timeComplexity: 'O(V³)',
    spaceComplexity: 'O(V²)',
    supportsNegative: true,
    allPairs: true,
    description: 'All-pairs shortest path via DP. Computes distances between every pair of nodes.',
    javaClass: 'FloydWarshall.java',
  },
}
