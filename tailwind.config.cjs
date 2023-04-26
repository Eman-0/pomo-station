/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "ct-dark-600": "#222",
        "ct-dark-200": "#575757",
        "ct-dark-100": "#6d6d6d",
        "ct-blue-600": "#88abff",
        "ct-blue-700": "#6a93f8",
        "ct-yellow-600": "#f9d13e",
      },
      fontFamily: {
        Poppins: ["Poppins, sans-serif"],
      },
      container: {
        center: true,
        padding: "1rem",
        screens: {
          lg: "1125px",
          xl: "1125px",
          "2xl": "1125px",
          "3xl": "1500px",
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
