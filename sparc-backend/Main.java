import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpExchange;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class Main {
    public static void main(String[] args) throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);

        server.createContext("/api/health", exchange -> {
            sendResponse(exchange, "{\"status\":\"ok\"}");
        });

        server.createContext("/api/graphs", exchange -> {
            addCorsHeaders(exchange);
            if (exchange.getRequestMethod().equalsIgnoreCase("OPTIONS")) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }
            
            String path = exchange.getRequestURI().getPath();
            if (path.equals("/api/graphs")) {
                sendResponse(exchange, "[\"small\", \"medium\", \"dense\", \"negative\"]");
            } else {
                String presetName = path.substring(path.lastIndexOf('/') + 1);
                Graph g = GraphPresets.presets.get(presetName);
                if (g != null) sendResponse(exchange, g.toJson());
                else sendError(exchange, 404, "Preset not found");
            }
        });

        server.createContext("/api/run", exchange -> {
            addCorsHeaders(exchange);
            if (exchange.getRequestMethod().equalsIgnoreCase("OPTIONS")) {
                exchange.sendResponseHeaders(204, -1); return;
            }
            
            String body = readBody(exchange.getRequestBody());
            Graph g = extractGraph(body);
            String safeBody = body.replaceAll("\"edges\"\\s*:\\s*\\[.*?\\]", "");
            Integer source = extractNullableInt(safeBody, "\"source\"");
            Integer target = extractNullableInt(safeBody, "\"target\"");
            String algo = extractString(safeBody, "\"algorithm\"");
            
            if (source == null) source = 0;
            
            AlgorithmResult res = null;
            if ("DIJKSTRA".equals(algo)) res = Dijkstra.run(g, source, target);
            else if ("BELLMAN_FORD".equals(algo)) res = BellmanFord.run(g, source, target);
            else if ("FLOYD_WARSHALL".equals(algo)) res = FloydWarshall.run(g, source, target);
            
            if (res != null) sendResponse(exchange, res.toJson());
            else sendError(exchange, 400, "Unknown algorithm");
        });

        server.createContext("/api/compare", exchange -> {
            addCorsHeaders(exchange);
            if (exchange.getRequestMethod().equalsIgnoreCase("OPTIONS")) {
                exchange.sendResponseHeaders(204, -1); return;
            }
            
            String body = readBody(exchange.getRequestBody());
            Graph g = extractGraph(body);
            String safeBody = body.replaceAll("\"edges\"\\s*:\\s*\\[.*?\\]", "");
            Integer source = extractNullableInt(safeBody, "\"source\"");
            Integer target = extractNullableInt(safeBody, "\"target\"");
            if (source == null) source = 0;
            
            AlgorithmResult d = Dijkstra.run(g, source, target);
            AlgorithmResult bf = BellmanFord.run(g, source, target);
            AlgorithmResult fw = FloydWarshall.run(g, source, target);
            
            sendResponse(exchange, "[" + d.toJson() + "," + bf.toJson() + "," + fw.toJson() + "]");
        });

        server.createContext("/api/benchmark", exchange -> {
            addCorsHeaders(exchange);
            if (exchange.getRequestMethod().equalsIgnoreCase("OPTIONS")) {
                exchange.sendResponseHeaders(204, -1); return;
            }
            
            String body = readBody(exchange.getRequestBody());
            String density = extractString(body, "\"density\"");
            int runs = extractInt(body.replaceAll("\"sizes\"\\s*:\\s*\\[.*?\\]", ""), "\"runs\"");
            
            int[] sizes = new int[0];
            Matcher mSizes = Pattern.compile("\"sizes\"\\s*:\\s*\\[([^\\]]+)\\]").matcher(body);
            if (mSizes.find()) {
                String[] parts = mSizes.group(1).split(",");
                sizes = new int[parts.length];
                for(int i=0; i<parts.length; i++) sizes[i] = Integer.parseInt(parts[i].trim());
            }
            
            String resJson = Benchmark.runBenchmark(sizes, density, runs);
            sendResponse(exchange, resJson);
        });

        server.setExecutor(java.util.concurrent.Executors.newCachedThreadPool());
        server.start();
        System.out.println("Native Java HTTP Backend Running on port 8080...");
    }

    private static void addCorsHeaders(HttpExchange exchange) {
        exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type");
    }

    private static void sendResponse(HttpExchange exchange, String json) throws IOException {
        addCorsHeaders(exchange);
        byte[] bytes = json.getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().add("Content-Type", "application/json");
        exchange.sendResponseHeaders(200, bytes.length);
        OutputStream os = exchange.getResponseBody();
        os.write(bytes);
        os.close();
    }

    private static void sendError(HttpExchange exchange, int code, String message) throws IOException {
        addCorsHeaders(exchange);
        String json = "{\"error\":\"" + message + "\"}";
        byte[] bytes = json.getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().add("Content-Type", "application/json");
        exchange.sendResponseHeaders(code, bytes.length);
        OutputStream os = exchange.getResponseBody();
        os.write(bytes);
        os.close();
    }

    private static String readBody(InputStream is) throws IOException {
        return new String(is.readAllBytes(), StandardCharsets.UTF_8);
    }

    private static Graph extractGraph(String body) {
        Graph g = new Graph();
        if(body.contains("\"directed\":false")) g.directed = false;
        
        Matcher m = Pattern.compile("\"id\"\\s*:\\s*(-?\\d+)").matcher(body.replaceAll("\"edges\"\\s*:\\s*\\[.*?\\]", ""));
        while(m.find()) g.nodes.add(new Graph.Node(Integer.parseInt(m.group(1))));
        
        Matcher me = Pattern.compile("\\{([^{}]+)\\}").matcher(body);
        while(me.find()) {
            String obj = me.group(1);
            if (obj.contains("\"source\"") && obj.contains("\"target\"") && obj.contains("\"weight\"")) {
                int s = extractInt(obj, "\"source\"");
                int t = extractInt(obj, "\"target\"");
                int w = extractInt(obj, "\"weight\"");
                g.edges.add(new Graph.Edge(s, t, w));
            }
        }
        return g;
    }

    public static int extractInt(String json, String key) {
        Matcher m = Pattern.compile(key + "\\s*:\\s*(-?\\d+)").matcher(json);
        if (m.find()) return Integer.parseInt(m.group(1));
        return -1; 
    }
    
    public static Integer extractNullableInt(String json, String key) {
        Matcher m = Pattern.compile(key + "\\s*:\\s*(-?\\d+|null)").matcher(json);
        if (m.find() && !m.group(1).equals("null")) return Integer.parseInt(m.group(1));
        return null;
    }
    
    public static String extractString(String json, String key) {
        Matcher m = Pattern.compile(key + "\\s*:\\s*\"([^\"]+)\"").matcher(json);
        if (m.find()) return m.group(1);
        return null;
    }
}
