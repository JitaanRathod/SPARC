/**
 * Bellman-Ford Algorithm implementation
 * Computes shortest paths from a source node and detects negative cycles.
 * 
 * @param {Object} graph - { nodes: number, edges: Array<{source, target, weight}> }
 * @param {number} source - The source node index
 */
function bellmanFord(graph, source) {
  const { nodes, edges } = graph;
  const numNodes = Array.isArray(nodes) ? nodes.length : nodes;
  
  const distances = Array(numNodes).fill(Infinity);
  distances[source] = 0;
  const previous = Array(numNodes).fill(null);

  const startTime = process.hrtime.bigint();

  // Relax all edges (numNodes - 1) times
  for (let i = 1; i < numNodes; i++) {
    for (const edge of edges) {
      const u = edge.source;
      const v = edge.target;
      const weight = edge.weight;
      if (distances[u] !== Infinity && distances[u] + weight < distances[v]) {
        distances[v] = distances[u] + weight;
        previous[v] = u;
      }
    }
  }

  // Check for negative weight cycle
  let hasNegativeCycle = false;
  for (const edge of edges) {
    const u = edge.source;
    const v = edge.target;
    const weight = edge.weight;
    if (distances[u] !== Infinity && distances[u] + weight < distances[v]) {
      hasNegativeCycle = true;
      break;
    }
  }

  const endTime = process.hrtime.bigint();
  const timeTakenNs = Number(endTime - startTime);

  return {
    algorithm: 'BELLMAN_FORD',
    executionTimeMs: timeTakenNs / 1_000_000,
    distances,
    previous,
    nodesVisited: numNodes,
    relaxations: edges.length * numNodes,
    hasNegativeCycle
  };
}

module.exports = bellmanFord;
