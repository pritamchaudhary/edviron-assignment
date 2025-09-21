/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4F46E5',
        'primary-hover': '#4338CA',
        background: '#F9FAFB',
        sidebar: '#111827',
        'sidebar-active': '#4F46E5',
      },
    },
  },
  plugins: [],
}