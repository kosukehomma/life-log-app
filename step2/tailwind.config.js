/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./form.html",
    "./src/**/*.{ts,js,html}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6A97CB",
        base: "#020202",
      },
      fontFamily: {
        sans: [
          "Noto Sans JP",
          "Hiragino Kaku Gothic ProN",
          "Meiryo",
          "Verdana",
          "sans-serif"
        ],
        gothic: ["Noto Sans JP", "sans-serif"],
      },
    },
  },
};
