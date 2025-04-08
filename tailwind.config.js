import { Flowbite } from "flowbite-react";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}", Flowbite, "./node_modules/tailwind-datepicker-react/dist/**/*.js",],
  theme: {
    extend: {
      colors: {
        'vistablue': '#8AAADC',
        'chryslerblue': '#531CB3',
        'babypowder': '#FDFFF7',
        'redpantone': '#E71D36',
        'lightcoral': '#F07C79',
        'aquamarine': '#23F0C7',
      }
    }
  },
  plugins: [Flowbite],
};

