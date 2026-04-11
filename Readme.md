# SPARC — Shortest Path Algorithm Research & Comparison

> A full-stack application for visualizing, running, and benchmarking three fundamental shortest-path graph algorithms: **Dijkstra**, **Bellman-Ford**, and **Floyd-Warshall**.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Backend (Java)](#backend-java)
  - [Frontend (React + Vite)](#frontend-react--vite)
- [Environment Variables](#environment-variables)
- [REST API Reference](#rest-api-reference)
- [Graph Payload Format](#graph-payload-format)
- [Algorithm Notes](#algorithm-notes)
- [Preset Graphs](#preset-graphs)

---

## Overview

SPARC is a research and educational tool that brings graph algorithms to life. The **Java backend** implements Dijkstra, Bellman-Ford, and Floyd-Warshall from scratch and exposes them via a lightweight HTTP REST API (no framework — uses `com.sun.net.httpserver`). The **React frontend** provides an interactive D3-powered graph editor, animated algorithm races, benchmark charts, and a complexity reference.

---

## Features

| Feature | Description |
|---|---|
| **Graph Visualizer** | Interactive D3-powered canvas — add nodes & edges, select source/target, and animate shortest paths in real-time |
| **Algorithm Race** | Side-by-side animated comparison showing all three algorithms competing on the same graph |
| **Benchmark Suite** | Configurable performance benchmarks across graph sizes and densities, with line & bar charts |
| **Complexity Reference** | Big-O tables, feature comparison matrix, and estimated runtime growth charts |
| **Docs Page** | Built-in API reference and algorithm notes |
| **Preset Graphs** | Four built-in graph presets: `small`, `medium`, `dense`, `negative` |
| **Mock Mode** | Frontend can run fully without the backend using built-in mock data |

---

## Tech Stack

### Backend
- **Language:** Java (no external dependencies)
- **HTTP Server:** `com.sun.net.httpserver.HttpServer` (JDK built-in)
- **Port:** `8080`
- **JSON:** Hand-rolled serialization (`StringBuilder`-based)

### Frontend
- **Framework:** React 18 + Vite 5
- **Routing:** React Router DOM v6
- **Styling:** Tailwind CSS + custom CSS variables
- **Charts:** Recharts
- **Graph Rendering:** D3.js v7
- **Animation:** Framer Motion
- **HTTP Client:** Axios
- **Icons:** Lucide React
- **Port:** `3000`

---

## Project Structure

```
SPARC-main/
├── sparc-backend/               # Java backend
│   ├── Main.java                # HTTP server + route handlers
│   ├── Graph.java               # Graph data model (nodes, edges)
│   ├── GraphPresets.java        # Built-in preset graphs
│   ├── AlgorithmResult.java     # Result model + JSON serialization
│   ├── Dijkstra.java            # Dijkstra's algorithm
│   ├── BellmanFord.java         # Bellman-Ford algorithm
│   ├── FloydWarshall.java       # Floyd-Warshall algorithm
│   └── Benchmark.java           # Benchmarking logic
│
└── sparc-frontend/              # React frontend
    ├── index.html
    ├── vite.config.js           # Vite + proxy config
    ├── tailwind.config.js
    ├── .env.example
    ├── src/
    │   ├── main.jsx
    │   ├── App.jsx              # Router setup
    │   ├── assets/styles/
    │   │   └── globals.css
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── GraphVisualizer.jsx
    │   │   ├── GraphInputForm.jsx
    │   │   ├── AlgorithmRace.jsx
    │   │   ├── AlgoResultCard.jsx
    │   │   ├── BenchmarkCharts.jsx
    │   │   ├── ComplexityTable.jsx
    │   │   ├── DistanceHeatmap.jsx
    │   │   ├── StepTracer.jsx
    │   │   └── LoadingSpinner.jsx
    │   ├── pages/
    │   │   ├── Dashboard.jsx
    │   │   ├── VisualizerPage.jsx
    │   │   ├── BenchmarkPage.jsx
    │   │   ├── RacePage.jsx
    │   │   ├── ComplexityPage.jsx
    │   │   └── DocsPage.jsx
    │   ├── hooks/
    │   │   ├── useAlgorithm.js
    │   │   ├── useBenchmark.js
    │   │   └── useGraph.js
    │   └── services/
    │       ├── api.js           # Axios API client
    │       └── mockData.js      # Fallback mock data
    └── package.json
```

---

## Getting Started

### Prerequisites

- **Java** 11 or later (JDK)
- **Node.js** 18 or later + npm

---

### Backend (Java)

The backend has **no build tool or framework** — compile and run manually with `javac` and `java`.

```bash
# Navigate to the backend directory
cd sparc-backend

# Compile all Java files
javac *.java

# Run the server
java Main
```

The API will be available at `http://localhost:8080`.

You should see:
```
Native Java HTTP Backend Running on port 8080...
```

---

### Frontend (React + Vite)

```bash
# Navigate to the frontend directory
cd sparc-frontend

# Copy the environment file and configure it
cp .env.example .env

# Install dependencies
npm install

# Start the development server
npm run dev
```

The UI will be available at `http://localhost:3000`.

Vite is configured to proxy all `/api` requests to `http://localhost:8080`, so the frontend and backend work seamlessly together.

#### Production Build

```bash
npm run build    # Output in dist/
npm run preview  # Serve the production build locally
```

---

## Environment Variables

Create `sparc-frontend/.env` from `.env.example`:

```env
# Set to true to use mock data without the backend running
VITE_USE_MOCK=true

# Override if the backend is deployed elsewhere
VITE_API_BASE=http://localhost:8080
```

Set `VITE_USE_MOCK=false` when the Java backend is running.

---

## REST API Reference

All endpoints use `Content-Type: application/json` and support CORS.

| Method | Endpoint | Description | Request Body | Response |
|---|---|---|---|---|
| `GET` | `/api/health` | Health check | — | `{ "status": "ok" }` |
| `GET` | `/api/graphs` | List preset names | — | `["small","medium","dense","negative"]` |
| `GET` | `/api/graphs/:preset` | Load a preset graph | — | `GraphPayload` |
| `POST` | `/api/run` | Run a single algorithm | `{ algorithm, graph, source, target? }` | `AlgorithmResult` |
| `POST` | `/api/compare` | Run all 3 algorithms | `{ graph, source, target? }` | `AlgorithmResult[]` |
| `POST` | `/api/benchmark` | Benchmark across sizes | `{ sizes[], density, runs }` | `BenchmarkResult[]` |

---

## Graph Payload Format

### Input — `GraphPayload`

```json
{
  "nodes": [
    { "id": 0, "label": "A" },
    { "id": 1, "label": "B" }
  ],
  "edges": [
    { "source": 0, "target": 1, "weight": 5 },
    { "source": 1, "target": 0, "weight": -2 }
  ],
  "directed": true
}
```

> Negative weights are supported for Bellman-Ford and Floyd-Warshall. Dijkstra requires non-negative weights.

### Output — `AlgorithmResult`

```json
{
  "algorithm": "DIJKSTRA",
  "executionTimeMs": 1.24,
  "nodesVisited": 3,
  "relaxations": 7,
  "distances": [0, 5, 8],
  "path": [0, 1, 2]
}
```

Floyd-Warshall returns `distanceMatrix` (2D array) instead of `distances`.

### Benchmark Request

```json
{
  "sizes": [10, 50, 100, 200],
  "density": "SPARSE",
  "runs": 5
}
```

`density` accepts `"SPARSE"` or `"DENSE"`.

---

## Algorithm Notes

### Dijkstra's Algorithm
- **Time Complexity:** O((V + E) log V) using a min-heap priority queue
- **Space Complexity:** O(V + E)
- **Constraint:** Non-negative edge weights only
- **Approach:** Greedy — processes each vertex once; expands lowest-cost frontier first
- **Use case:** Best for single-source shortest paths in maps, routing, GPS

### Bellman-Ford
- **Time Complexity:** O(V × E)
- **Space Complexity:** O(V)
- **Supports:** Negative edge weights; detects negative-weight cycles
- **Approach:** Relaxes all edges V−1 times; a final pass detects negative cycles
- **Use case:** Financial arbitrage detection, networks with variable/negative costs

### Floyd-Warshall
- **Time Complexity:** O(V³)
- **Space Complexity:** O(V²)
- **Supports:** Negative edge weights; all-pairs shortest paths in one pass
- **Approach:** Dynamic programming — `dp[i][j]` = shortest distance from i to j via any intermediate nodes
- **Constraint:** Not practical for V > ~500 due to cubic complexity

---

## Preset Graphs

| Name | Nodes | Description |
|---|---|---|
| `small` | 5 | Simple directed graph with multiple path options |
| `medium` | 9 | Classic textbook example (similar to CLRS) |
| `dense` | 6 | Fully connected directed graph with random weights |
| `negative` | 5 | Directed graph with negative edge weights for testing Bellman-Ford |

---