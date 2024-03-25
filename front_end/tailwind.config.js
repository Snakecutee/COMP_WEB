module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        'login': "url('./assets/background.jpg')"
      }
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
