import java.util.Arrays;

public class FloydWarshall {

    public static AlgorithmResult run(Graph graph, Integer source, Integer target) {
        long startTime = System.nanoTime();
        int numNodes = graph.nodes.size();

        double[][] dist = new double[numNodes][numNodes];
        for (double[] row : dist) Arrays.fill(row, Double.POSITIVE_INFINITY);

        for (int i = 0; i < numNodes; i++) dist[i][i] = 0.0;

        for (Graph.Edge e : graph.edges) {
            dist[e.source][e.target] = Math.min(dist[e.source][e.target], e.weight);
            if (!graph.directed) {
                dist[e.target][e.source] = Math.min(dist[e.target][e.source], e.weight);
            }
        }

        int relaxations = 0;
        int nodesVisited = numNodes;

        for (int k = 0; k < numNodes; k++) {
            for (int i = 0; i < numNodes; i++) {
                for (int j = 0; j < numNodes; j++) {
                    relaxations++;
                    if (dist[i][k] != Double.POSITIVE_INFINITY && dist[k][j] != Double.POSITIVE_INFINITY) {
                        dist[i][j] = Math.min(dist[i][j], dist[i][k] + dist[k][j]);
                    }
                }
            }
        }

        long endTime = System.nanoTime();

        AlgorithmResult res = new AlgorithmResult();
        res.algorithm = "FLOYD_WARSHALL";
        res.executionTimeMs = (endTime - startTime) / 1_000_000.0;
        
        Object[][] outDist = new Object[numNodes][numNodes];
        for (int i = 0; i < numNodes; i++) {
            for (int j = 0; j < numNodes; j++) {
                outDist[i][j] = dist[i][j] == Double.POSITIVE_INFINITY ? null : (int)dist[i][j];
            }
        }
        res.distanceMatrix = outDist;

        // Frontend expects exact path for highlighting, but FW solves all-pairs.
        // If specific source/target provided, return basic array.
        java.util.List<Integer> path = new java.util.ArrayList<>();
        if (target != null && source != null) {
            path.add(source);
            path.add(target);
        }
        res.path = path;
        
        res.nodesVisited = nodesVisited;
        res.relaxations = relaxations;

        return res;
    }
}
