/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // Enable class-based dark mode
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        darkBackground: "#1a202c", // Custom dark mode background
        darkText: "#e2e8f0", // Custom dark mode text color
        lightBackground: "#ffffff", // Custom light mode background
        lightText: "#1a202c", // Custom light mode text color
      },
      
    },
  },
  plugins: [],
};
