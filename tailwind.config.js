/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,ts,js,jsx,tsx}'],
  theme: {
    fontFamily: {
      'mono': ['IBM Plex mono', 'monospace'],
      'cursive': ['Cinzel Decorative', 'cursive'],
      'serif': ['Merriweather', 'serif', 'ui-serif', 'Georgia'],
      'sans': ['IBM Plex Sans', 'sans-serif', 'ui-sans-serif', 'system-ui'],
    },
    extend: {},
  },
  plugins: [],
}

