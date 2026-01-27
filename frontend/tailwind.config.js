/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'pulse-slow': 'pulse-slow 15s infinite alternate ease-in-out',
        'pulse-slow-reverse': 'pulse-slow-reverse 12s infinite alternate ease-in-out',
      },
      keyframes: {
        'pulse-slow': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' }, // Added quotes here
          '50%': { transform: 'translate(30px, 20px) scale(1.1)' }, // Added quotes here
        },
        'pulse-slow-reverse': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' }, // Added quotes here
          '50%': { transform: 'translate(-30px, -20px) scale(1.05)' }, // Added quotes here
        },
      },
    },
  },
  plugins: [],
}