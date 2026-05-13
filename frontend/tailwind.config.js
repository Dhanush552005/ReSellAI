/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          primary: '#F4F7FB',
          secondary: '#EEF2F9',
        },
        brand: {
          primary: '#5B8CFF',
          secondary: '#7ED7FF',
          premium: '#B8A8FF',
          success: '#34C8A0',
        },
        glass: {
          DEFAULT: 'rgba(255, 255, 255, 0.55)',
          border: 'rgba(255, 255, 255, 0.35)',
        }
      },
      backgroundImage: {
        'vision-gradient': 'linear-gradient(135deg, #F4F7FB 0%, #EAF2FF 50%, #F8FBFF 100%)',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(15, 23, 42, 0.08)',
        'glass-hover': '0 12px 48px rgba(15, 23, 42, 0.12)',
      },
      animation: {
        'pulse-slow': 'pulse-slow 15s infinite alternate ease-in-out',
        'pulse-slow-reverse': 'pulse-slow-reverse 12s infinite alternate ease-in-out',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
      },
      keyframes: {
        'pulse-slow': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(30px, 20px) scale(1.1)' },
        },
        'pulse-slow-reverse': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(-30px, -20px) scale(1.05)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'shimmer': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        }
      },
    },
  },
  plugins: [],
}