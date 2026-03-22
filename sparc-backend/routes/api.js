const express = require('express');
const router = express.Router();
const presets = require('../utils/graphPresets');
const dijkstra = require('../algorithms/dijkstra');
const bellmanFord = require('../algorithms/bellmanFord');
const floydWarshall = require('../algorithms/floydWarshall');
const runBenchmark = require('../services/benchmark');

function runAlgo(algorithmName, graph, source, target) {
  let result;
  switch (algorithmName) {
    case 'DIJKSTRA': result = dijkstra(graph, source); break;
    case 'BELLMAN_FORD': result = bellmanFord(graph, source); break;
    case 'FLOYD_WARSHALL': result = floydWarshall(graph, source); break;
    default: throw new Error(`Unknown algorithm: ${algorithmName}`);
  }

  // Reconstruct path if target is provided
  if (target != null && result.previous && result.previous.length > 0) {
    const path = [];
    let curr = target;
    while (curr != null) {
      path.unshift(curr);
      if (curr === source) break;
      curr = result.previous[curr];
    }
    if (path[0] === source) {
      result.path = path;
    } else {
      result.path = []; // no valid path
    }
  } else if (algorithmName === 'FLOYD_WARSHALL' && target != null) {
      // Basic fallback since FW path reconstruction wasn't fully tracked
      result.path = [source, target];
  }

  return result;
}

// Health Check
router.get('/health', (req, res) => res.json({ status: 'ok' }));

// List Presets
router.get('/graphs', (req, res) => {
  res.json(Object.keys(presets));
});

// Get Preset
router.get('/graphs/:preset', (req, res) => {
  const presetName = req.params.preset;
  if (!presets[presetName]) return res.status(404).json({ message: 'Preset not found' });
  res.json(presets[presetName]);
});

// Run Single Algorithm
router.post('/run', (req, res) => {
  const { algorithm, graph, source, target } = req.body;
  if (!algorithm || !graph || source == null) {
      return res.status(400).json({ message: 'Missing required parameters' });
  }
  try {
    const result = runAlgo(algorithm, graph, source, target);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Compare All Algorithms
router.post('/compare', (req, res) => {
  const { graph, source, target } = req.body;
  if (!graph || source == null) {
    return res.status(400).json({ message: 'Missing required parameters' });
  }
  try {
    const dResult = runAlgo('DIJKSTRA', graph, source, target);
    const bfResult = runAlgo('BELLMAN_FORD', graph, source, target);
    const fwResult = runAlgo('FLOYD_WARSHALL', graph, source, target);
    
    res.json([dResult, bfResult, fwResult]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Benchmark
router.post('/benchmark', (req, res) => {
  const { sizes, density, runs } = req.body;
  if (!sizes || !density || !runs) {
      return res.status(400).json({ message: 'Missing required parameters (sizes, density, runs)' });
  }
  
  try {
    const results = runBenchmark(sizes, density, runs);
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Benchmarking failed' });
  }
});

module.exports = router;
