/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f2f7f0',
          100: '#e1ede0',
          200: '#c5dbc3',
          300: '#9ec19a',
          400: '#75a371',
          500: '#5C7D52', // Primary Brand Green
          600: '#4a6541', // Dark Green Hover
          700: '#3c5235',
          800: '#32422d',
          900: '#2a3726',
        },
        emeraldAccent: '#74b72e',
        darkHeading: '#111827',
        darkSlate: '#0F172A',
        bgLight: '#F4F4F4',
        sectionLight: '#FAFAFA',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'soft-float': '0 20px 40px -15px rgba(92, 125, 82, 0.12)',
        'card-glow': '0 10px 30px -5px rgba(116, 183, 46, 0.15)',
        'premium': '0 25px 50px -12px rgba(15, 23, 42, 0.08)',
      },
      backgroundImage: {
        'dotted-pattern': 'radial-gradient(#5C7D52 1.5px, transparent 1.5px)',
      },
    },
  },
  plugins: [],
}
