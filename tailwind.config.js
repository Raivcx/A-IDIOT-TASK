/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        spaceGray: '#1a1b26',
        deepBlue: '#16161e',
        neonCyan: '#7dcfff',
        neonViolet: '#bb9af7',
      }
    },
  },
  plugins: [],
}
