import java.util.List;

public class AlgorithmResult {
    public String algorithm;
    public double executionTimeMs;
    public Object[] distances;
    public Object[][] distanceMatrix; 
    public List<Integer> path;
    public int nodesVisited;
    public int relaxations;

    public String toJson() {
        StringBuilder sb = new StringBuilder();
        sb.append("{");
        sb.append("\"algorithm\":\"").append(algorithm != null ? algorithm : "").append("\",");
        sb.append("\"executionTimeMs\":").append(executionTimeMs).append(",");
        sb.append("\"nodesVisited\":").append(nodesVisited).append(",");
        sb.append("\"relaxations\":").append(relaxations).append(",");

        if (path != null) {
            sb.append("\"path\":[");
            for (int i = 0; i < path.size(); i++) {
                sb.append(path.get(i));
                if (i < path.size() - 1) sb.append(",");
            }
            sb.append("],");
        } else {
            sb.append("\"path\":[],");
        }

        if (distanceMatrix != null) {
            sb.append("\"distanceMatrix\":[");
            for (int i = 0; i < distanceMatrix.length; i++) {
                sb.append("[");
                for (int j = 0; j < distanceMatrix[i].length; j++) {
                    Object val = distanceMatrix[i][j];
                    sb.append(val == null ? "null" : val.toString());
                    if (j < distanceMatrix[i].length - 1) sb.append(",");
                }
                sb.append("]");
                if (i < distanceMatrix.length - 1) sb.append(",");
            }
            sb.append("]");
        } else if (distances != null) {
            sb.append("\"distances\":[");
            for (int i = 0; i < distances.length; i++) {
                Object val = distances[i];
                sb.append(val == null ? "null" : val.toString());
                if (i < distances.length - 1) sb.append(",");
            }
            sb.append("]");
        } else {
            sb.append("\"distances\":[]");
        }

        sb.append("}");
        return sb.toString();
    }
}
