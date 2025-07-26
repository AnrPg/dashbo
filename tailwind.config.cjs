// tailwind.config.mjs
import animatePlugin from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      borderColor: {
        border: "var(--border)",
      },
    },
  },
  darkMode: "class",
  plugins: [animatePlugin],
};

export default config;
