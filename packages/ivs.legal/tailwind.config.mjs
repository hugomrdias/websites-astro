/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fefdf8',
          100: '#fdf9e7',
          200: '#faf0c4',
          300: '#f5e197',
          400: '#eecf68',
          500: '#e6b947',
          600: '#d4a339',
          700: '#b18830',
          800: '#8f6d2e',
          900: '#755a28',
          950: '#433014',
        },
        
        navy: {
          50: '#b5b3ad',
          100: '#7c7b74',
          200: '#6f6d66',
          300: '#62605b',
          400: '#494844',
          500: '#3b3a37',
          600: '#31312e',
          700: '#2a2a28',
          800: '#222221',
          900: '#191918',
          950: '#111110',
        }
        // navy: {
        //   50: '#f0f4f8',
        //   100: '#d9e2ec',
        //   200: '#bcccdc',
        //   300: '#9fb3c8',
        //   400: '#829ab1',
        //   500: '#627d98',
        //   600: '#486581',
        //   700: '#334e68',
        //   800: '#243b53',
        //   900: '#102a43',
        //   950: '#0a1929',
        // }
      },
      fontFamily: {
        'serif': ['Playfair Display Variable', 'serif'],
        'sans': ['Inter Variable', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

const sandDark = {
	sand1: "#111110",
	sand2: "#191918",
	sand3: "#222221",
	sand4: "#2a2a28",
	sand5: "#31312e",
	sand6: "#3b3a37",
	sand7: "#494844",
	sand8: "#62605b",
	sand9: "#6f6d66",
	sand10: "#7c7b74",
	sand11: "#b5b3ad",
	sand12: "#eeeeec",
}