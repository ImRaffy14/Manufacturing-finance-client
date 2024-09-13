/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'custom-gradient': 'linear-gradient(135deg, #f0f4f8, #d9e2ec)',
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