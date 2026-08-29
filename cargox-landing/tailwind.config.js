/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cargox: {
          dark: '#002a35',
          yellow: '#ffda00',
          fallback: '#1a1a2e',
          mobileMenu: '#6682c2',
          brandGreen: '#5C7D52',
        },
      },
      fontFamily: {
        barlow: ['"Barlow Condensed"', 'sans-serif'],
        sans: ['Helvetica', 'Arial', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
