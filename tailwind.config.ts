import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#000000",
        surface: "#121212",
        surfaceLight: "#1e1e1e",
        border: "#262626",
        primary: {
          DEFAULT: "#FE2C55", // TikTok signature pink/red
          hover: "#E02447",
        },
        secondary: {
          DEFAULT: "#25F4EE", // TikTok cyan
          hover: "#1FD0CA",
        },
        igGradientStart: "#833AB4",
        igGradientMid: "#FD1D1D",
        igGradientEnd: "#FCB045",
      },
      animation: {
        "heart-burst": "heartBurst 0.8s ease-out forwards",
        "pulse-fast": "pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin 4s linear infinite",
      },
      keyframes: {
        heartBurst: {
          "0%": { transform: "scale(0) rotate(-15deg)", opacity: "0" },
          "50%": { transform: "scale(1.3) rotate(0deg)", opacity: "1" },
          "80%": { transform: "scale(1) rotate(5deg)", opacity: "1" },
          "100%": { transform: "scale(1.2) translateY(-20px)", opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
