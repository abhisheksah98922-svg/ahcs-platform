/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // AHCS Design System Core Brand Tokens
        primary: {
          DEFAULT: '#102A43', // Deep medical navy
          light: '#1F3D5B',
          dark: '#0B1D2F',
        },
        secondary: {
          DEFAULT: '#1769AA', // Professional healthcare blue
          light: '#2884CD',
          dark: '#104F82',
        },
        accent: {
          DEFAULT: '#0F9D8A', // Healthcare Teal
          light: '#13BBA4',
          dark: '#0B7A6B',
        },
        canvas: {
          DEFAULT: '#F5F8FC', // Main page background
          subtle: '#EEF3F9',
        },
        card: {
          DEFAULT: '#FFFFFF', // Card background
          subtle: '#F8FAFD',
        },
        content: {
          primary: '#172B4D',   // Primary text
          secondary: '#62748A', // Secondary text
          muted: '#8A99AD',
        },
        border: {
          soft: '#DFE7F0',      // Soft divider borders
          DEFAULT: '#DFE7F0',
          focus: '#1769AA',
        },
        status: {
          success: '#16835F',
          warning: '#B7791F',
          error: '#C53030',
        },
        // Legacy backward-compatibility tokens
        ahcs: {
          navy: '#102A43',
          'navy-dark': '#0B1D2F',
          teal: '#0F9D8A',
          blue: '#1769AA',
          surface: '#FFFFFF',
          canvas: '#F5F8FC',
          border: '#DFE7F0',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(16, 42, 67, 0.04), 0 1px 2px -1px rgba(16, 42, 67, 0.04)',
        'card': '0 4px 14px 0 rgba(16, 42, 67, 0.06)',
        'elevated': '0 12px 28px -4px rgba(16, 42, 67, 0.1)',
      },
    },
  },
  plugins: [],
};
