import java.util.ArrayList;
import java.util.Arrays;
import java.util.PriorityQueue;
import java.util.List;
import java.util.Collections;

public class Dijkstra {
    static class NodeDist implements Comparable<NodeDist> {
        int id; double dist;
        NodeDist(int i, double d) { id = i; dist = d; }
        public int compareTo(NodeDist o) { return Double.compare(dist, o.dist); }
    }

    public static AlgorithmResult run(Graph graph, int source, Integer target) {
        long startTime = System.nanoTime();
        int numNodes = graph.nodes.size();
        
        double[] dist = new double[numNodes];
        Arrays.fill(dist, Double.POSITIVE_INFINITY);
        dist[source] = 0;
        
        Integer[] prev = new Integer[numNodes];
        boolean[] visited = new boolean[numNodes];
        
        PriorityQueue<NodeDist> pq = new PriorityQueue<>();
        pq.add(new NodeDist(source, 0));
        
        int relaxations = 0;
        int nodesVisited = 0;
        
        List<List<Graph.Edge>> adj = new ArrayList<>();
        for (int i = 0; i < numNodes; i++) adj.add(new ArrayList<>());
        for (Graph.Edge e : graph.edges) {
            adj.get(e.source).add(e);
            if (!graph.directed) adj.get(e.target).add(new Graph.Edge(e.target, e.source, e.weight));
        }

        while (!pq.isEmpty()) {
            NodeDist cur = pq.poll();
            if (visited[cur.id]) continue;
            visited[cur.id] = true;
            nodesVisited++;
            
            if (target != null && cur.id == target) break;

            for (Graph.Edge edge : adj.get(cur.id)) {
                relaxations++;
                double newDist = dist[cur.id] + edge.weight;
                if (newDist < dist[edge.target]) {
                    dist[edge.target] = newDist;
                    prev[edge.target] = cur.id;
                    pq.add(new NodeDist(edge.target, newDist));
                }
            }
        }

        long endTime = System.nanoTime();

        AlgorithmResult res = new AlgorithmResult();
        res.algorithm = "DIJKSTRA";
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
