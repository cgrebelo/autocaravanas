import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        forest: "#12382f",
        moss: "#386150",
        sand: "#f3eadb",
        clay: "#d97945",
        road: "#2f3430"
      },
      boxShadow: {
        soft: "0 18px 50px rgba(18, 56, 47, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
