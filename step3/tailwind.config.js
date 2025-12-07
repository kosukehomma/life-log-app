/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#6a97cb',
        secondary: '#55ebbb',
      },
      keyframes: {
        'slide-down': {
          '0%': { transform: 'scaleY(0)', opacity: 0 },
          '100%': { transform: 'scaleY(1)', opacity: 1 },
        },
        'fade-in': {
          '0%': { opacity: 0, transform: 'translate(-50%, 20px)' },
          '100%': { opacity: 1, transform: 'translate(-50%, 0px)' },
        },
      },
      animation: {
        'slide-down': 'slide-down 0.25s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: true,
    content: true,
  },
};
