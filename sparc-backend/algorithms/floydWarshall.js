/**
 * Floyd-Warshall Algorithm implementation
 * Computes shortest paths between all pairs of nodes.
 * 
 * @param {Object} graph - { nodes: number, edges: Array<{source, target, weight}> }
 * @param {number} source - Used to filter the matrix to return source specific distances to match other algorithms.
 */
function floydWarshall(graph, source = 0) {
  const { nodes, edges } = graph;
  const numNodes = Array.isArray(nodes) ? nodes.length : nodes;
  
  // Initialize distance matrix
  const dist = Array.from({ length: numNodes }, () => Array(numNodes).fill(Infinity));
  
  for (let i = 0; i < numNodes; i++) {
    dist[i][i] = 0;
  }
  
  for (const edge of edges) {
    // If multiple edges exist between same pairs, we take the minimum (typically not an issue here)
    if (edge.weight < dist[edge.source][edge.target]) {
        dist[edge.source][edge.target] = edge.weight;
    }
  }

  const startTime = process.hrtime.bigint();

  // Core Floyd-Warshall logic
  for (let k = 0; k < numNodes; k++) {
    for (let i = 0; i < numNodes; i++) {
      for (let j = 0; j < numNodes; j++) {
        if (dist[i][k] !== Infinity && dist[k][j] !== Infinity) {
          if (dist[i][k] + dist[k][j] < dist[i][j]) {
            dist[i][j] = dist[i][k] + dist[k][j];
          }
        }
      }
    }
  }

  // Check for negative cycles
  let hasNegativeCycle = false;
  for (let i = 0; i < numNodes; i++) {
    if (dist[i][i] < 0) {
      hasNegativeCycle = true;
      break;
    }
  }

  const endTime = process.hrtime.bigint();
  const timeTakenNs = Number(endTime - startTime);

  // To maintain consistency in frontend expectations which return distance from a specific source
  const distances = Array(numNodes).fill(Infinity);
  for (let i = 0; i < numNodes; i++) {
      distances[i] = dist[source][i];
  }

  return {
    algorithm: 'FLOYD_WARSHALL',
    executionTimeMs: timeTakenNs / 1_000_000,
    distanceMatrix: dist,
    distances: distances,
    previous: [],
    nodesVisited: numNodes,
    relaxations: numNodes * numNodes * numNodes,
    hasNegativeCycle
  };
}

module.exports = floydWarshall;
