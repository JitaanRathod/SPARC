public class FloydWarshall {

    static final int INF = 99999;
    static final int MAX_NODES = 150;

    int V;
    int[][] dist;

    public FloydWarshall(int vertices) {
        if (vertices > MAX_NODES) {
            System.out.println("Error: Max allowed nodes is " + MAX_NODES);
            return;
        }
        this.V = vertices;
        this.dist = new int[V][V];
    }

    public void loadGraph(int[][] graph) {
        for (int i = 0; i < V; i++)
            for (int j = 0; j < V; j++)
                dist[i][j] = graph[i][j];
    }

    public void run() {
        for (int k = 0; k < V; k++) {
            for (int i = 0; i < V; i++) {
                for (int j = 0; j < V; j++) {
                    if (dist[i][k] != INF && dist[k][j] != INF) {
                        if (dist[i][k] + dist[k][j] < dist[i][j]) {
                            dist[i][j] = dist[i][k] + dist[k][j];
                        }
                    }
                }
            }
        }
    }

    public boolean hasNegativeCycle() {
        for (int i = 0; i < V; i++) {
            if (dist[i][i] < 0) return true;
        }
        return false;
    }

    public void printResult() {
        System.out.println("\nShortest Distance Matrix:");
        System.out.print("     ");
        for (int j = 0; j < V; j++)
            System.out.printf("%6d", j);
        System.out.println();

        for (int i = 0; i < V; i++) {
            System.out.printf("[%2d] ", i);
            for (int j = 0; j < V; j++) {
                if (dist[i][j] == INF)
                    System.out.printf("%6s", "INF");
                else
                    System.out.printf("%6d", dist[i][j]);
            }
            System.out.println();
        }
    }

    public long runWithTiming() {
        long start = System.nanoTime();
        run();
        long end = System.nanoTime();
        long timeTaken = (end - start);
        System.out.println("Floyd-Warshall Time: " + timeTaken + " ns  (" + timeTaken / 1_000_000.0 + " ms)");
        return timeTaken;
    }
}
