/**
 * Dijkstra's Algorithm implementation
 * Computes the shortest paths from a source node to all other nodes.
 * 
 * @param {Object} graph - { nodes: number, edges: Array<{source, target, weight}> }
 * @param {number} source - The source node index
 * @returns {Object} { distances, path } or simple result
 */
function dijkstra(graph, source) {
  const { nodes, edges } = graph;
  const numNodes = Array.isArray(nodes) ? nodes.length : nodes;
  
  // Initialize distances
  const distances = Array(numNodes).fill(Infinity);
  distances[source] = 0;

  // Track the visited nodes
  const visited = Array(numNodes).fill(false);
  const previous = Array(numNodes).fill(null);

  // Build adjacency list for faster lookup
  const adj = Array.from({ length: numNodes }, () => []);
  for (const edge of edges) {
    adj[edge.source].push({ target: edge.target, weight: edge.weight });
    // Assuming directed graph. If undirected, add the reverse edge here.
    // The frontend payload usually implies directed based on standard datasets.
  }

  const startTime = process.hrtime.bigint();

  for (let i = 0; i < numNodes; i++) {
    // Find the unvisited node with the smallest distance
    let u = -1;
    let minDistance = Infinity;
    
    for (let j = 0; j < numNodes; j++) {
      if (!visited[j] && distances[j] < minDistance) {
        minDistance = distances[j];
        u = j;
      }
    }

    if (u === -1) break; // All remaining vertices are inaccessible

    visited[u] = true;

    // Update distances of adjacent nodes
    for (const neighbor of adj[u]) {
      const v = neighbor.target;
      const weight = neighbor.weight;

      if (!visited[v] && distances[u] !== Infinity && distances[u] + weight < distances[v]) {
        distances[v] = distances[u] + weight;
        previous[v] = u;
      }
    }
  }

  const endTime = process.hrtime.bigint();
  const timeTakenNs = Number(endTime - startTime);

  return {
    algorithm: 'DIJKSTRA',
    executionTimeMs: timeTakenNs / 1_000_000,
    distances,
    previous,
    nodesVisited: numNodes,
    relaxations: edges.length,
    hasNegativeCycle: false // Dijkstra doesn't handle/detect negative cycles properly
  };
}

module.exports = dijkstra;
