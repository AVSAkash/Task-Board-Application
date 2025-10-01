/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx,js,jsx}', // <- Make sure ts and tsx are included
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
