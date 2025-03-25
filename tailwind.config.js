import { Flowbite } from "flowbite-react";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}", Flowbite],
  theme: {
    extend: {
      colors: {
        'vistablue': '#8AAADC',
        'chryslerblue': '#531CB3',
        'babypowder': '#FDFFF7',
        'redpantone': '#E71D36',
        'lightcoral': '#F07C79',
        
      }
    }
  },
  plugins: [Flowbite],
};

