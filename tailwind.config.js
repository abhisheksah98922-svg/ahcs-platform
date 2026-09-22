/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ahcs: {
          blue: '#1e40af',
          'blue-light': '#2563eb',
          'blue-card': '#1565c0',
          'blue-dark': '#0f2b5c',
        }
      }
    },
  },
  plugins: [],
}
