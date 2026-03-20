/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        serif: ['Instrument Serif', 'serif'],
        mono: ['DM Mono', 'monospace'],
      },
      colors: {
        paper: { DEFAULT: '#f2f0ea', 2: '#e8e5dc', 3: '#d8d4c8' },
        ink: '#0d0d0b',
        muted: { DEFAULT: '#9a9688', 2: '#6b6860' },
        accent: {
          red: '#c8341e', 'red-bg': '#fdf0ed',
          green: '#1a5c38', 'green-bg': '#edf5f0',
          amber: '#8a5a00', 'amber-bg': '#fdf5e8',
          blue: '#1a3a6b', 'blue-bg': '#edf2fd',
        },
      },
      fontSize: { '2xs': '10px', xs: '11px' },
      letterSpacing: { widest2: '0.14em', widest3: '0.16em' },
    },
  },
  plugins: [],
}
