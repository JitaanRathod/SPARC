const dijkstra = require('../algorithms/dijkstra');
const bellmanFord = require('../algorithms/bellmanFord');
const floydWarshall = require('../algorithms/floydWarshall');

/**
 * Generate a random graph
 */
function generateGraph(nodes, density) {
  const isDense = density === 'DENSE';
  // Sparse: ~3 edges per node. Dense: ~N/2 edges per node
  const maxEdgesPerNode = isDense ? Math.max(1, Math.floor(nodes / 2)) : Math.min(3, nodes - 1);

  const edges = [];

  for (let i = 0; i < nodes; i++) {
    const numEdges = Math.floor(Math.random() * maxEdgesPerNode) + 1;
    for (let j = 0; j < numEdges; j++) {
      let target = Math.floor(Math.random() * nodes);
      if (target === i) target = (target + 1) % nodes;

      const weight = Math.floor(Math.random() * 100) + 1; // Weights 1-100
      edges.push({ source: i, target, weight });
    }
  }

  return { nodes, edges };
}

/**
 * Run a benchmark across datasets
 */
function runBenchmark(sizes, density, runs) {
  const results = [];

  for (const size of sizes) {
    let dTimeNs = 0n;
    let bfTimeNs = 0n;
    let fwTimeNs = 0n;

    for (let r = 0; r < runs; r++) {
      const graph = generateGraph(size, density);
      const source = 0; // standard source

      const dResult = dijkstra(graph, source);
      const bfResult = bellmanFord(graph, source);
      const fwResult = floydWarshall(graph, source);

      dTimeNs += BigInt(Math.floor(dResult.timeTakenNs));
      bfTimeNs += BigInt(Math.floor(bfResult.timeTakenNs));
      fwTimeNs += BigInt(Math.floor(fwResult.timeTakenNs));
    }

    // Averages
    results.push({
      size,
      dijkstra: Number(dTimeNs / BigInt(runs)) / 1_000_000,
      bellmanFord: Number(bfTimeNs / BigInt(runs)) / 1_000_000,
      floydWarshall: Number(fwTimeNs / BigInt(runs)) / 1_000_000
    });
  }

  return results;
}

module.exports = runBenchmark;
