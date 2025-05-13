import { Flowbite } from "flowbite-react";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    Flowbite,
    "./node_modules/tailwind-datepicker-react/dist/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        vistablue: "#8AAADC",
        chryslerblue: "#531CB3",
        babypowder: "#FDFFF7",
        redpantone: "#E71D36",
        lightcoral: "#F07C79",
        aquamarine: "#23F0C7",
      },
      keyframes: {
        translate: {
          101: "101%",
        },
        gradient: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        marquee: {
          from: { transform: "translateX(0%)" },
          to: { transform: "translateX(-50%)" },
        },
      },
      animation: {
        gradient: "gradient 3s linear infinite",
        "fade-in": "fadeIn 1s ease-out",
        marquee: "marquee 15s linear infinite",
      },
    },
  },
  plugins: [Flowbite],
};
