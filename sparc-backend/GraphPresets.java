import java.util.HashMap;
import java.util.Map;

public class GraphPresets {
    
    public static Map<String, Graph> presets = new HashMap<>();

    static {
        Graph small = new Graph();
        for (int i = 0; i < 5; i++) small.nodes.add(new Graph.Node(i));
        small.edges.add(new Graph.Edge(0, 1, 10));
        small.edges.add(new Graph.Edge(0, 4, 100));
        small.edges.add(new Graph.Edge(1, 2, 50));
        small.edges.add(new Graph.Edge(2, 4, 10));
        small.edges.add(new Graph.Edge(1, 4, 50));
        small.edges.add(new Graph.Edge(0, 3, 30));
        small.edges.add(new Graph.Edge(3, 4, 60));
        presets.put("small", small);

        Graph medium = new Graph();
        for (int i = 0; i < 9; i++) medium.nodes.add(new Graph.Node(i));
        medium.edges.add(new Graph.Edge(0, 1, 4));
        medium.edges.add(new Graph.Edge(0, 7, 8));
        medium.edges.add(new Graph.Edge(1, 2, 8));
        medium.edges.add(new Graph.Edge(1, 7, 11));
        medium.edges.add(new Graph.Edge(2, 3, 7));
        medium.edges.add(new Graph.Edge(2, 8, 2));
        medium.edges.add(new Graph.Edge(2, 5, 4));
        medium.edges.add(new Graph.Edge(3, 4, 9));
        medium.edges.add(new Graph.Edge(3, 5, 14));
        medium.edges.add(new Graph.Edge(4, 5, 10));
        medium.edges.add(new Graph.Edge(5, 6, 2));
        medium.edges.add(new Graph.Edge(6, 7, 1));
        medium.edges.add(new Graph.Edge(6, 8, 6));
        medium.edges.add(new Graph.Edge(7, 8, 7));
        presets.put("medium", medium);

        Graph dense = new Graph();
        for (int i = 0; i < 6; i++) dense.nodes.add(new Graph.Node(i));
        for (int i = 0; i < 6; i++) {
            for (int j = i + 1; j < 6; j++) {
                int w = (int) (Math.random() * 50) + 1;
                dense.edges.add(new Graph.Edge(i, j, w));
            }
        }
        presets.put("dense", dense);

        Graph negative = new Graph();
        for (int i = 0; i < 5; i++) negative.nodes.add(new Graph.Node(i));
        negative.edges.add(new Graph.Edge(0, 1, -1));
        negative.edges.add(new Graph.Edge(0, 2, 4));
        negative.edges.add(new Graph.Edge(1, 2, 3));
        negative.edges.add(new Graph.Edge(1, 3, 2));
        negative.edges.add(new Graph.Edge(1, 4, 2));
        negative.edges.add(new Graph.Edge(3, 2, 5));
        negative.edges.add(new Graph.Edge(3, 1, 1));
        negative.edges.add(new Graph.Edge(4, 3, -3));
        presets.put("negative", negative);
    }
}
