import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        almond: {
          50: "#f7f2ef",
          100: "#efe3dc",
          200: "#dfc7b8",
          300: "#cba78f",
          400: "#b78469",
          500: "#9c6a53",
          600: "#7f5343",
          700: "#654236",
          800: "#4d332b",
          900: "#3b2722"
        },
        blush: "#e6c9d1"
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui"]
      }
    }
  },
  plugins: []
};

export default config;
