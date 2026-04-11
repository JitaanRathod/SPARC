import java.util.Arrays;
import java.util.ArrayList;
import java.util.List;
import java.util.Collections;

public class BellmanFord {

    public static AlgorithmResult run(Graph graph, int source, Integer target) {
        long startTime = System.nanoTime();
        int numNodes = graph.nodes.size();

        double[] dist = new double[numNodes];
        Arrays.fill(dist, Double.POSITIVE_INFINITY);
        dist[source] = 0;

        Integer[] prev = new Integer[numNodes];
        
        int relaxations = 0;
        int nodesVisited = numNodes;
        
        List<Graph.Edge> allEdges = new ArrayList<>(graph.edges);
        if (!graph.directed) {
            for (Graph.Edge e : graph.edges) {
                allEdges.add(new Graph.Edge(e.target, e.source, e.weight));
            }
        }

        for (int i = 0; i < numNodes - 1; i++) {
            boolean updated = false;
            for (Graph.Edge edge : allEdges) {
                relaxations++;
                if (dist[edge.source] != Double.POSITIVE_INFINITY && dist[edge.source] + edge.weight < dist[edge.target]) {
                    dist[edge.target] = dist[edge.source] + edge.weight;
                    prev[edge.target] = edge.source;
                    updated = true;
                }
            }
            if (!updated) break;
        }

        long endTime = System.nanoTime();

        AlgorithmResult res = new AlgorithmResult();
        res.algorithm = "BELLMAN_FORD";
        res.executionTimeMs = (endTime - startTime) / 1_000_000.0;
        
        Object[] outDist = new Object[numNodes];
        for (int i = 0; i < numNodes; i++) outDist[i] = dist[i] == Double.POSITIVE_INFINITY ? null : (int)dist[i];
        res.distances = outDist;

        List<Integer> path = new ArrayList<>();
        if (target != null && prev[target] != null) {
            Integer curr = target;
            while (curr != null) {
                path.add(curr);
                curr = prev[curr];
            }
            Collections.reverse(path);
        } else if (target != null && source == target) {
            path.add(source);
        }
        res.path = path;
        res.nodesVisited = nodesVisited;
        res.relaxations = relaxations;

        return res;
    }
}
