/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#131f24',
        foreground: '#c6b198',
        accent: '#c6b198',
        'accent-fg': '#131f24',
        muted: 'rgba(198, 177, 152, 0.4)',
        border: 'rgba(198, 177, 152, 0.2)'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['"Cormorant Garamond"', 'serif'],
      },
    },
  },
  plugins: [],
}
