# SPARC Frontend

**Shortest Path Algorithm Research & Comparison** — React frontend for the [SPARC Java backend](https://github.com/JitaanRathod/SPARC).

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | React 18 + Vite |
| Routing | React Router v6 |
| Charts | Recharts |
| Graph Viz | D3.js v7 |
| Animations | Framer Motion + CSS |
| Styling | Tailwind CSS + custom CSS vars |
| API | Axios → Java Spring Boot |

## Features

| Feature | Description |
|---|---|
| 🔷 **Graph Visualizer** | D3 force-directed graph, drag nodes, click to select source |
| 📊 **Benchmark Charts** | Line (log-scale) + bar charts, exportable to JSON/CSV |
| ⚡ **Race Mode** | Animated side-by-side progress bars for all 3 algorithms |
| 🔢 **Step Tracer** | Play/pause animated path trace node by node |
| 🌡️ **Heatmap** | Floyd-Warshall distance matrix rendered as color heatmap |
| 📐 **Complexity Reference** | Big-O cards, feature matrix, runtime growth table |
| 📄 **Docs** | REST API reference, graph payload format, setup guide |
| ✏️ **Graph Editor** | Add/remove nodes & edges, import/export JSON |

## Project Structure

```
sparc-frontend/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── assets/styles/
│   │   └── globals.css
│   ├── services/
│   │   ├── api.js          ← Axios REST client (connects to Java backend)
│   │   └── mockData.js     ← Mock data when backend is unavailable
│   ├── hooks/
│   │   ├── useAlgorithm.js ← Run / compare algorithms
│   │   ├── useBenchmark.js ← Benchmark runner
│   │   └── useGraph.js     ← Graph state management
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── GraphVisualizer.jsx   ← D3 canvas
│   │   ├── GraphInputForm.jsx    ← Node/edge editor
│   │   ├── AlgoResultCard.jsx    ← Per-algorithm result
│   │   ├── BenchmarkCharts.jsx   ← Recharts line + bar
│   │   ├── AlgorithmRace.jsx     ← Animated race bars
│   │   ├── StepTracer.jsx        ← Step-by-step path player
│   │   ├── DistanceHeatmap.jsx   ← FW matrix heatmap
│   │   ├── ComplexityTable.jsx   ← Big-O reference
│   │   └── LoadingSpinner.jsx
│   └── pages/
│       ├── Dashboard.jsx
│       ├── VisualizerPage.jsx
│       ├── BenchmarkPage.jsx
│       ├── RacePage.jsx
│       ├── ComplexityPage.jsx
│       └── DocsPage.jsx
```

## Getting Started

```bash
# Install dependencies
npm install

# Copy env file
cp .env.example .env

# Run with mock data (no backend required)
npm run dev

# To connect to Java backend, set in .env:
# VITE_USE_MOCK=false
# then start backend: cd ../backend && mvn spring-boot:run
```

## Backend API Contract

The frontend expects these endpoints from `localhost:8080`:

```
POST /api/run          → Run single algorithm
POST /api/compare      → Run all 3 algorithms
POST /api/benchmark    → Benchmark across sizes
GET  /api/graphs/:name → Load preset graph
GET  /api/health       → Health check
```

See `/docs` page in the app for full API reference.
