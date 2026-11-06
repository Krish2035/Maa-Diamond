import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./frontend/src/**/*.{js,ts,jsx,tsx,mdx}",
    "./frontend/src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./frontend/src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./frontend/src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: "#03060c",
          900: "#070a12",
          850: "#0c121e",
          800: "#111a2e",
          700: "#1e293b",
          600: "#334155",
        },
        gold: {
          100: "#fdf8ec",
          200: "#f7ebd0",
          300: "#edd49c",
          400: "#dfb85e",
          500: "#d4af37",
          600: "#b89025",
          700: "#8f6c1a",
        },
        diamond: {
          blue: "#0284c7",
          glow: "#38bdf8",
          silver: "#e2e8f0",
          pure: "#ffffff",
        },
      },
      fontFamily: {
        sans: ["'Calibri'", "'Segoe UI'", "Candara", "Arial", "sans-serif"],
        serif: ["'Calibri'", "'Segoe UI'", "Candara", "Arial", "sans-serif"],
      },
      boxShadow: {
        "xs": "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      },
    },
  },
  plugins: [],
};
export default config;
