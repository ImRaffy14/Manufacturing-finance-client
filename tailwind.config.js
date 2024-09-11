/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'BG': "url('/src/assets/BG.jpg')",
      },
      backdropBlur: {
        lg: '100px',
      }
    },
  },
  plugins: [
    require('daisyui'),
  ],
}