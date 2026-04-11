// Graph presets based on standard algorithmic testing scenarios

const presets = {
  small: {
    nodes: Array.from({ length: 5 }, (_, i) => ({ id: i, label: String(i) })),
    edges: [
      { source: 0, target: 1, weight: 10 },
      { source: 0, target: 3, weight: 30 },
      { source: 0, target: 4, weight: 100 },
      { source: 1, target: 2, weight: 50 },
      { source: 2, target: 4, weight: 10 },
      { source: 3, target: 2, weight: 20 },
      { source: 3, target: 4, weight: 60 }
    ],
    directed: true
  },
  medium: {
    nodes: Array.from({ length: 9 }, (_, i) => ({ id: i, label: String(i) })),
    edges: [
      { source: 0, target: 1, weight: 4 },
      { source: 0, target: 7, weight: 8 },
      { source: 1, target: 2, weight: 8 },
      { source: 1, target: 7, weight: 11 },
      { source: 2, target: 3, weight: 7 },
      { source: 2, target: 8, weight: 2 },
      { source: 2, target: 5, weight: 4 },
      { source: 3, target: 4, weight: 9 },
      { source: 3, target: 5, weight: 14 },
      { source: 4, target: 5, weight: 10 },
      { source: 5, target: 6, weight: 2 },
      { source: 6, target: 7, weight: 1 },
      { source: 6, target: 8, weight: 6 },
      { source: 7, target: 8, weight: 7 }
    ],
    directed: true
  },
  negative: {
    nodes: Array.from({ length: 4 }, (_, i) => ({ id: i, label: String(i) })),
    edges: [
      { source: 0, target: 1, weight: 4 },
      { source: 0, target: 3, weight: 5 },
      { source: 1, target: 2, weight: -5 }, // Negative weight
      { source: 2, target: 3, weight: 3 }
    ],
    directed: true
  },
  dense: {
    nodes: Array.from({ length: 6 }, (_, i) => ({ id: i, label: String(i) })),
    edges: [
      { source: 0, target: 1, weight: 2 }, { source: 0, target: 2, weight: 4 }, { source: 0, target: 3, weight: 1 }, { source: 0, target: 4, weight: 8 }, { source: 0, target: 5, weight: 3 },
      { source: 1, target: 2, weight: 1 }, { source: 1, target: 3, weight: 7 }, { source: 1, target: 4, weight: 2 }, { source: 1, target: 5, weight: 5 },
      { source: 2, target: 3, weight: 3 }, { source: 2, target: 4, weight: 6 }, { source: 2, target: 5, weight: 1 },
      { source: 3, target: 4, weight: 5 }, { source: 3, target: 5, weight: 4 },
      { source: 4, target: 5, weight: 2 }
    ],
    directed: true
  }
};

module.exports = presets;
