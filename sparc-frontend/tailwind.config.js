/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Orbitron"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        void: '#050812',
        abyss: '#090e1a',
        surface: '#0d1526',
        panel: '#111d35',
        border: '#1a2d50',
        cyan: { DEFAULT: '#00e5ff', dim: '#00b8cc', glow: '#00e5ff33' },
        violet: { DEFAULT: '#7c3aed', bright: '#a855f7', glow: '#7c3aed33' },
        amber: { DEFAULT: '#f59e0b', glow: '#f59e0b33' },
        emerald: { DEFAULT: '#10b981', glow: '#10b98133' },
        rose: { DEFAULT: '#f43f5e', glow: '#f43f5e33' },
        muted: '#4a6080',
        ghost: '#8ba3c0',
        snow: '#e2ecf8',
      },
      boxShadow: {
        'cyan-glow': '0 0 20px #00e5ff44, 0 0 60px #00e5ff11',
        'violet-glow': '0 0 20px #7c3aed44, 0 0 60px #7c3aed11',
        'amber-glow': '0 0 20px #f59e0b44',
        'panel': '0 4px 24px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)',
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'scan': 'scan 3s linear infinite',
        'flicker': 'flicker 4s steps(1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        flicker: {
          '0%, 95%, 100%': { opacity: 1 },
          '96%, 99%': { opacity: 0.8 },
        }
      }
    }
  },
  plugins: []
}
