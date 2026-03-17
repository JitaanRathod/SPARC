import java.util.*;

class Edge {
    int src, dest, weight;

    Edge(int s, int d, int w) {
        src = s;
        dest = d;
        weight = w;
    }
}

class Graph {

    int V;
    List<Edge> edges = new ArrayList<>();

    Graph(int V) {
        this.V = V;
    }

    void addEdge(int s, int d, int w) {
        edges.add(new Edge(s,d,w));
    }
}

class BellmanFord1 {

    static void run(Graph g, int source){

        int V = g.V;
        int[] dist = new int[V];

        Arrays.fill(dist,Integer.MAX_VALUE);
        dist[source] = 0;

        for(int i=1;i<V;i++){

            for(Edge e : g.edges){

                if(dist[e.src] != Integer.MAX_VALUE &&
                   dist[e.src] + e.weight < dist[e.dest]){

                    dist[e.dest] = dist[e.src] + e.weight;
                }
            }
        }

        // Negative cycle check
        for(Edge e : g.edges){

            if(dist[e.src] != Integer.MAX_VALUE &&
               dist[e.src] + e.weight < dist[e.dest]){

                System.out.println("Negative Cycle Detected!");
                return;
            }
        }

        System.out.println("\nShortest Distances:");

        for(int i=0;i<V;i++){
            System.out.println("0 -> " + i + " = " + dist[i]);
        }
    }
}

public class BellmanFord {

    static Scanner sc = new Scanner(System.in);

    public static void main(String[] args){

        System.out.println("----- Bellman Ford Setup -----");
        System.out.println("1. Predefined Dataset");
        System.out.println("2. User Input Dataset");

        int choice = sc.nextInt();

        Graph graph;

        if(choice == 1){
            graph = predefinedDataset();
        }
        else{
            graph = userInputDataset();
        }

        long start = System.nanoTime();

        BellmanFord.run(graph,0);

        long end = System.nanoTime();

        System.out.println("\nExecution Time: "+(end-start)+" ns");
    }

    // Predefined Graph
    static Graph predefinedDataset(){

        Graph g = new Graph(5);

        g.addEdge(0,1,6);
        g.addEdge(0,2,7);
        g.addEdge(1,3,5);
        g.addEdge(1,4,-4);
        g.addEdge(2,3,-3);
        g.addEdge(3,1,-2);
        g.addEdge(4,0,2);
        g.addEdge(4,3,7);

        System.out.println("\nLoaded Predefined Dataset");

        return g;
    }

    // User Input Graph
    static Graph userInputDataset(){

        System.out.println("Enter number of nodes (max 150):");

        int V = sc.nextInt();

        if(V > 150){
            System.out.println("Node limit exceeded!");
            System.exit(0);
        }

        Graph g = new Graph(V);

        System.out.println("Enter number of edges:");
        int E = sc.nextInt();

        for(int i=0;i<E;i++){

            System.out.println("Enter src dest weight:");

            int s = sc.nextInt();
            int d = sc.nextInt();
            int w = sc.nextInt();

            g.addEdge(s,d,w);
        }

        return g;
    }
}