/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          magenta: "#ff0055",
          pink: "#ff1493",
          purple: "#9d4edd",
          cyan: "#00f0ff",
          blue: "#00b4d8",
          yellow: "#eaff00",
          acid: "#f5ee38",
          lime: "#39ff14",
        },
        leather: {
          mustard: "#c88a24",
          tan: "#e09f3e",
          warm: "#b57614",
          dark: "#633c09",
          cognac: "#8b4513",
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        neon: ['"Yellowtail"', '"Pacifico"', 'cursive'],
        industrial: ['"Teko"', '"VT323"', 'sans-serif'],
        pixel: ['"VT323"', 'monospace'],
      },
      backgroundImage: {
        'logo-gradient': 'linear-gradient(135deg, #00f0ff 0%, #7b2cbf 50%, #ff0055 100%)',
        'logo-gradient-hover': 'linear-gradient(135deg, #00f0ff 10%, #9d4edd 55%, #ff0055 100%)',
        'logo-gradient-horizontal': 'linear-gradient(90deg, #00f0ff 0%, #7b2cbf 50%, #ff0055 100%)',
      },
      boxShadow: {
        'logo-ring': '0 0 18px rgba(0, 240, 255, 0.45), 0 0 30px rgba(255, 0, 85, 0.45)',
        'logo-ring-sm': '0 0 10px rgba(0, 240, 255, 0.4), 0 0 16px rgba(255, 0, 85, 0.4)',
        'neon-cyan': '0 0 12px rgba(0, 240, 255, 0.45)',
        'neon-magenta': '0 0 12px rgba(255, 0, 85, 0.45)',
        'neon-yellow': '0 0 12px rgba(234, 255, 0, 0.45)',
      },
    },
  },
  plugins: [],
}
