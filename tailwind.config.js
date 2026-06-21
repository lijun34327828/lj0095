/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        navy: {
          50: '#f0f4fa',
          100: '#d9e2f3',
          200: '#b3c5e7',
          300: '#8da8db',
          400: '#678bcf',
          500: '#416ec3',
          600: '#34589c',
          700: '#274275',
          800: '#1a2c4e',
          900: '#1a2744',
          950: '#0d1525',
        },
        amber: {
          gold: '#d4a853',
          goldLight: '#e8c77a',
          goldDark: '#b8913d',
        },
        warning: {
          red: '#e74c3c',
          redLight: '#ff6b5b',
          redDark: '#c0392b',
        },
        success: {
          green: '#27ae60',
          greenLight: '#2ecc71',
          greenDark: '#229954',
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'Consolas', 'monospace'],
        sans: ['"Source Han Sans CN"', '"PingFang SC"', '"Microsoft YaHei"', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'breathe': 'breathe 2s ease-in-out infinite',
        'number-roll': 'numberRoll 0.3s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        numberRoll: {
          '0%': { transform: 'translateY(-8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(231, 76, 60, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(231, 76, 60, 0.8)' },
        },
      },
    },
  },
  plugins: [],
};
