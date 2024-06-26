/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    colors: {
      'primary': '#475569', // slate-600 
      'secondary': '#cbd5e1', // slate-300
      'title': '#1e293b', // slate-800 - title
      'text': '#334155', // slate-700 - text
      'input-bg': '#e2e8f0', // slate-200 - input bg
      'border': '#cbd5e1', // slate-300 - border
      'primarySelection': '#673AB7',
      'secondarySelection': '#FFC107',
      'primaryHighlight': '#673AB7',
      'secondaryHighlight': '#FFC107',
      'contrastText': '#ffffff',
      'customBeige': '#F5F5F5',
      'white': '#ffffff',
      'black': '#000000',
      'green': {
        400: '#34d399',
        500: '#22c55e',
        600: '#16a34a',
        700: '#15803d'
      },
      'red': {
        400: '#f87171',
        500: '#ef4444',
        600: '#dc2626',
        700: '#b91c1c'
      },
      'blue': {
        400: '#60a5fa',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8'
      },
      'purple': {
        400: '#c084fc',
        500: '#a855f7',
        600: '#9333ea',
        700: '#7e22ce'
      }

    }
  },
  plugins: [],
}