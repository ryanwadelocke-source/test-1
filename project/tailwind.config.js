/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Share Tech Mono"', 'monospace'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      colors: {
        lcd: {
          bg: '#cdd9a4',
          'bg-dark': '#bac990',
          text: '#1c2810',
          'text-mid': '#243318',
          'text-light': '#cdd9a4',
          border: '#7a9060',
          'border-light': '#a0b878',
          invert: '#1c2810',
          highlight: '#b8cc8c',
          pressed: '#a0b878',
          stripe: '#c4d099',
        },
        shell: {
          main: '#5ab8a8',
          light: '#7dd4c4',
          lighter: '#a0e4d8',
          dark: '#3a9888',
          darker: '#2a7868',
          button: '#2a9080',
          'button-light': '#4ab4a4',
        },
      },
      boxShadow: {
        lcd: 'inset 0 2px 4px rgba(0,0,0,0.3), inset 0 -1px 2px rgba(255,255,255,0.2)',
        shell: '0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.3)',
        button: 'inset 0 1px 2px rgba(255,255,255,0.3), inset 0 -1px 2px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.3)',
        'button-pressed': 'inset 0 2px 4px rgba(0,0,0,0.4)',
      },
    },
  },
  plugins: [],
};
