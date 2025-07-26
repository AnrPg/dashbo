// tailwind.config.mjs
import animatePlugin from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",       // my App Router
    "./components/**/*.{js,ts,jsx,tsx}",// my shared components
+   "./styles/**/*.{css,scss}",          // CSS modules or global CSS files
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
