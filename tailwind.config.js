/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./public/**/*.html",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#0a0404',
          800: '#120708',
          700: '#1a0a0c',
          600: '#250f12',
          500: '#381419',
        },
        crimson: {
          500: '#ff1e2d',
          600: '#e01220',
          700: '#b30915',
          glow: 'rgba(255, 30, 45, 0.4)',
        }
      },
      fontFamily: {
        bebas: ['"Bebas Neue"', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
        code: ['"Fira Code"', 'monospace'],
        hand: ['Caveat', 'cursive'],
      },
      animation: {
        'glow-pulse': 'glowPulse 3s infinite ease-in-out',
        'float': 'float 6s infinite ease-in-out',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(255, 30, 45, 0.2)' },
          '50%': { boxShadow: '0 0 35px rgba(255, 30, 45, 0.6)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        }
      }
    },
  },
  plugins: [],
}
