/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  container: {
    center: true,
    padding: "1rem",
    screens: {
      sm: "100%",
      md: "100%",
      lg: "1440px",
      xl: "1280px",
    },
  },

  theme: {
    extend: {
      fontFamily: {
        Opensans: ["Open Sans"],
        Bitter: ["Bitter"],
        Merriweather: ["Merriweather"],
        Noticia: ["Noticia"],
        Poppins: ["Poppins"],
        Domine: ["Domine"],
        prompt: ["Prompt"],
      },
      colors: {
        color1: "#76ad5f",
        color2: "#8BB977",
        color3: "#6d9eeb",
        
        // Override blue with slate colors
        // All bg-blue-* will now use slate colors
        blue: {
          50: '#f8fafc',   // slate-50
          100: '#f1f5f9',  // slate-100
          200: '#e2e8f0',  // slate-200
          300: '#cbd5e1',  // slate-300
          400: '#94a3b8',  // slate-400
          500: '#64748b',  // slate-500
          600: '#80A1BA',  // slate-600 (your sidebar bg)
          700: '#668faeff',  // slate-700 (your hover state)
          800: '#1e293b',  // slate-800
          900: '#0f172a',  // slate-900
          950: '#020617',  // slate-950
        },
      },
    },
  },
  plugins: [],
};