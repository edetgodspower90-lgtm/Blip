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
        background: "#07080E",
        surface: "#0D101C",
        surfaceLight: "#131728",
        border: "rgba(139, 92, 246, 0.12)",
        midnight: {
          DEFAULT: "#07080E",
          surface: "#0D101C",
          card: "#131728",
          subtle: "#1A1F36",
          border: "rgba(139, 92, 246, 0.14)",
        },
        primary: {
          DEFAULT: "#8B5CF6", // Electric Violet
          hover: "#7C3AED",
          light: "#A78BFA",
          dark: "#6D28D9",
        },
        secondary: {
          DEFAULT: "#06B6D4", // Soft Cyan
          hover: "#22D3EE",
          light: "#67E8F9",
          dark: "#0891B2",
        },
        accent: {
          violet: "#8B5CF6",
          cyan: "#06B6D4",
          emerald: "#10B981",
          amber: "#F59E0B",
        },
      },
      boxShadow: {
        "ambient-violet": "0 0 40px -10px rgba(139, 92, 246, 0.25)",
        "ambient-cyan": "0 0 35px -10px rgba(6, 182, 212, 0.22)",
        "glass-card": "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        "subtle-glow": "0 0 20px rgba(139, 92, 246, 0.15)",
      },
      animation: {
        "heart-burst": "heartBurst 0.8s ease-out forwards",
        "pulse-subtle": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float-slow": "float 6s ease-in-out infinite",
      },
      keyframes: {
        heartBurst: {
          "0%": { transform: "scale(0) rotate(-15deg)", opacity: "0" },
          "50%": { transform: "scale(1.25) rotate(0deg)", opacity: "1" },
          "80%": { transform: "scale(1) rotate(5deg)", opacity: "1" },
          "100%": { transform: "scale(1.15) translateY(-16px)", opacity: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
