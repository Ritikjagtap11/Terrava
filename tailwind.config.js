/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F5F0E8', // Warm cream BG
          100: '#E6F0EA',
          200: '#C2DFCE',
          300: '#9EBEA7',
          400: '#69AA85',
          500: '#2A8A5C', // Emerald
          600: '#1D6B45',
          700: '#0D4A30', // Deep Green
          800: '#083321',
          900: '#041C11',
        },
        secondary: {
          400: '#EBD48C',
          500: '#D4A843', // Gold
          600: '#B08831',
        },
        accent: {
          500: '#EDD26A', // Shine
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}