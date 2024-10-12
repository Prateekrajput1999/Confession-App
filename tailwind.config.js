/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      container: {
        screens: {
          sm: "640px",
        },
      },
      screens: {
        xs: "424px",
        xxs: "320px",
        ...defaultTheme.screens,
      },
    },
  },
  plugins: [],
};
