/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: "#1F4E5F",
          muted: "#4D727E",
          primary: "#79A8A9",
          light: "#F4F7F7",
        },
      },
    },
  },
  plugins: [],
}
