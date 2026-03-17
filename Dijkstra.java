import java.util.*;

class Edge {
    int dest, weight;

    Edge(int d, int w) {
        dest = d;
        weight = w;
    }
}

class Graph {

    int V;
    List<List<Edge>> adj;

    Graph(int V) {
        this.V = V;
        adj = new ArrayList<>();

        for(int i = 0; i < V; i++){
            adj.add(new ArrayList<>());
        }
    }

    void addEdge(int s, int d, int w) {
        adj.get(s).add(new Edge(d, w));
    }
}

class DijkstraAlgo {

    static void run(Graph g, int source){

        int V = g.V;
        int[] dist = new int[V];

        Arrays.fill(dist, Integer.MAX_VALUE);
        dist[source] = 0;

        PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[1]));
        pq.add(new int[]{source, 0});

        while(!pq.isEmpty()){

            int[] curr = pq.poll();
            int u = curr[0];

            for(Edge e : g.adj.get(u)){

                if(dist[u] != Integer.MAX_VALUE &&
                   dist[u] + e.weight < dist[e.dest]){

                    dist[e.dest] = dist[u] + e.weight;
                    pq.add(new int[]{e.dest, dist[e.dest]});
                }
            }
        }

        System.out.println("\nShortest Distances:");

        for(int i = 0; i < V; i++){
            System.out.println("0 -> " + i + " = " + dist[i]);
        }
    }
}

public class Dijkstra {

    static Scanner sc = new Scanner(System.in);

    public static void main(String[] args){

        System.out.println("----- Dijkstra Setup -----");
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

        DijkstraAlgo.run(graph, 0);

        long end = System.nanoTime();

        System.out.println("\nExecution Time: " + (end - start) + " ns");
    }

    // Predefined Graph
    static Graph predefinedDataset(){

        Graph g = new Graph(5);

        g.addEdge(0,1,10);
        g.addEdge(0,4,5);
        g.addEdge(1,2,1);
        g.addEdge(4,1,3);
        g.addEdge(4,2,9);
        g.addEdge(4,3,2);
        g.addEdge(2,3,4);
        g.addEdge(3,2,6);
        g.addEdge(3,0,7);

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

        for(int i = 0; i < E; i++){

            System.out.println("Enter src dest weight:");

            int s = sc.nextInt();
            int d = sc.nextInt();
            int w = sc.nextInt();

            g.addEdge(s, d, w);
        }

        return g;
    }
}
