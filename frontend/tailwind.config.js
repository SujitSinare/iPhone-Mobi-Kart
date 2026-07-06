/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#111827',
        mist: '#f7f8fb',
        steel: '#4b5563',
        accent: '#0f766e',
      },
      boxShadow: {
        soft: '0 10px 35px rgba(17, 24, 39, 0.08)',
      },
    },
  },
  plugins: [],
};
