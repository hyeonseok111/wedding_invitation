/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Noto Sans KR'", "sans-serif"]
      },
      colors: {
        primary: "#fce4ec"
      }
    }
  },
  plugins: []
}
