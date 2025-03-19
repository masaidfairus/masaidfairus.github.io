/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}", "./dist/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        primary: '#E9F554',  // Neon Yellow-Green
        background: '#1e1e1e', // Dark Gray/Black
      },
      fontFamily: {
        heading: ['"Times New Roman"', 'serif'],
        body: ["Plus Jakarta Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
}

