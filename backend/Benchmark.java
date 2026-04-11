import java.util.ArrayList;
import java.util.List;

public class Benchmark {

    public static class BenchmarkResult {
        public int size;
        public double dijkstra;
        public double bellmanFord;
        public double floydWarshall;

        public String toJson() {
            return "{\"size\":" + size + ",\"dijkstra\":" + dijkstra + ",\"bellmanFord\":" + bellmanFord + ",\"floydWarshall\":" + floydWarshall + "}";
        }
    }

    private static Graph generateGraph(int nodes, String density) {
        Graph g = new Graph();
        g.directed = true;
        for (int i = 0; i < nodes; i++) {
            g.nodes.add(new Graph.Node(i));
        }

        boolean isDense = "DENSE".equals(density);
        int maxEdgesPerNode = isDense ? Math.max(1, nodes / 2) : Math.min(3, nodes - 1);

        for (int i = 0; i < nodes; i++) {
            int numEdges = (int) (Math.random() * maxEdgesPerNode) + 1;
            for (int j = 0; j < numEdges; j++) {
                int target = (int) (Math.random() * nodes);
                if (target == i) target = (target + 1) % nodes;
                int weight = (int) (Math.random() * 100) + 1;
                g.edges.add(new Graph.Edge(i, target, weight));
            }
        }
        return g;
    }

    public static String runBenchmark(int[] sizes, String density, int runs) {
        StringBuilder sb = new StringBuilder();
        sb.append("[");

        for (int k = 0; k < sizes.length; k++) {
            int size = sizes[k];
            long dTimeNs = 0;
            long bfTimeNs = 0;
            long fwTimeNs = 0;

            for (int r = 0; r < runs; r++) {
                Graph graph = generateGraph(size, density);
                int source = 0;

                long t1 = System.nanoTime();
                Dijkstra.run(graph, source, null);
                long t2 = System.nanoTime();
                dTimeNs += (t2 - t1);

                t1 = System.nanoTime();
                BellmanFord.run(graph, source, null);
                t2 = System.nanoTime();
                bfTimeNs += (t2 - t1);

                t1 = System.nanoTime();
                FloydWarshall.run(graph, source, null);
                t2 = System.nanoTime();
                fwTimeNs += (t2 - t1);
            }

            BenchmarkResult r = new BenchmarkResult();
            r.size = size;
            r.dijkstra = (dTimeNs / (double)runs) / 1_000_000.0;
            r.bellmanFord = (bfTimeNs / (double)runs) / 1_000_000.0;
            r.floydWarshall = (fwTimeNs / (double)runs) / 1_000_000.0;
            
            sb.append(r.toJson());
            if (k < sizes.length - 1) sb.append(",");
        }
        
        sb.append("]");
        return sb.toString();
    }
}
