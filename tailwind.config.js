import { Flowbite } from "flowbite-react";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}", Flowbite],
  theme: {
    extend: {},
  },
  plugins: [Flowbite],
};
