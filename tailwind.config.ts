// tailwind.config.ts
import { type Config } from "tailwindcss";
import animatePlugin from "tailwindcss-animate";

const config: Config = {
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
  // use the simple string form rather than a one-element array
  darkMode: "class",
  // import the plugin rather than require()
  plugins: [animatePlugin],
};

export default config;
