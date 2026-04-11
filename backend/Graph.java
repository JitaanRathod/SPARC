import java.util.ArrayList;
import java.util.List;

public class Graph {
    public static class Node {
        public int id;
        public String label;
        public Node(int id) { this.id = id; this.label = String.valueOf(id); }
    }

    public static class Edge {
        public int source;
        public int target;
        public int weight;
        public Edge(int s, int t, int w) { source = s; target = t; weight = w; }
    }

    public List<Node> nodes = new ArrayList<>();
    public List<Edge> edges = new ArrayList<>();
    public boolean directed = true;

    // Output JSON for the frontend
    public String toJson() {
        StringBuilder sb = new StringBuilder();
        sb.append("{");
        sb.append("\"directed\":").append(directed).append(",");
        sb.append("\"nodes\":[");
        for (int i = 0; i < nodes.size(); i++) {
            sb.append("{\"id\":").append(nodes.get(i).id).append(",\"label\":\"").append(nodes.get(i).label).append("\"}");
            if (i < nodes.size() - 1) sb.append(",");
        }
        sb.append("],\"edges\":[");
        for (int i = 0; i < edges.size(); i++) {
            Edge e = edges.get(i);
            sb.append("{\"source\":").append(e.source)
              .append(",\"target\":").append(e.target)
              .append(",\"weight\":").append(e.weight).append("}");
            if (i < edges.size() - 1) sb.append(",");
        }
        sb.append("]}");
        return sb.toString();
    }
}
