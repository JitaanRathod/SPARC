import java.util.Scanner;

public class Main {

    static final int INF = FloydWarshall.INF;

    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);

        System.out.println("==========================================");
        System.out.println("   SPARC - Team 5 | Floyd-Warshall");
        System.out.println("==========================================");
        System.out.println("Choose input mode:");
        System.out.println("  1 - Use predefined dataset");
        System.out.println("  2 - Enter your own graph");
        System.out.print("Your choice: ");

        int choice = sc.nextInt();

        if (choice == 1) {
            runPredefined();
        } else if (choice == 2) {
            runUserInput(sc);
        } else {
            System.out.println("Invalid choice. Exiting.");
        }

        sc.close();
    }

    static void runPredefined() {

        System.out.println("\n[Predefined Dataset - 5 nodes]");

        int[][] graph = {
            {  0,   10,  INF,   30,  100 },
            { INF,   0,   50,  INF,  INF },
            { INF, INF,    0,  INF,   10 },
            { INF, INF,   20,    0,   60 },
            { INF, INF,  INF,  INF,    0 }
        };

        FloydWarshall fw = new FloydWarshall(5);
        fw.loadGraph(graph);
        processAndPrint(fw);
    }

    static void runUserInput(Scanner sc) {

        System.out.println("\n[User Input Mode]");
        System.out.print("Enter number of nodes (max 150): ");
        int V = sc.nextInt();

        if (V <= 0 || V > 150) {
            System.out.println("Error: Node count must be between 1 and 150.");
            return;
        }

        System.out.print("Enter number of edges: ");
        int E = sc.nextInt();

        int[][] graph = new int[V][V];
        for (int i = 0; i < V; i++) {
            for (int j = 0; j < V; j++) {
                graph[i][j] = (i == j) ? 0 : INF;
            }
        }

        System.out.println("\nEnter each edge as:  source  destination  weight");
        System.out.println("(Nodes are numbered 0 to " + (V - 1) + ")");
        System.out.println("--------------------------------------------------");

        for (int e = 0; e < E; e++) {
            System.out.print("Edge " + (e + 1) + ": ");
            int src  = sc.nextInt();
            int dest = sc.nextInt();
            int wt   = sc.nextInt();

            if (src < 0 || src >= V || dest < 0 || dest >= V) {
                System.out.println("  Invalid node number. Skipping this edge.");
                e--;
                continue;
            }

            graph[src][dest] = wt;
        }

        System.out.println("\nGraph loaded. Running Floyd-Warshall...");

        FloydWarshall fw = new FloydWarshall(V);
        fw.loadGraph(graph);
        processAndPrint(fw);
    }

    static void processAndPrint(FloydWarshall fw) {

        long time = fw.runWithTiming();

        if (fw.hasNegativeCycle()) {
            System.out.println("\nWARNING: Negative cycle detected!");
        } else {
            fw.printResult();
        }

        System.out.println("\n==========================================");
        System.out.println("Time taken: " + time + " ns");
        System.out.println("           (" + time / 1_000_000.0 + " ms)");
        System.out.println("==========================================");
    }
}