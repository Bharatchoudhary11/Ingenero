import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./data/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1455FE",
          50: "#f2f7ff",
          100: "#e6eeff",
          200: "#c1d4ff",
          300: "#9ab9ff",
          400: "#739eff",
          500: "#4c83ff",
          600: "#1455fe",
          700: "#0e3fc2",
          800: "#082984",
          900: "#021247"
        },
        accent: "#FFAA3D",
        slate: {
          25: "#f7f9fb"
        }
      },
      boxShadow: {
        card: "0 24px 48px rgba(27, 39, 55, 0.08)"
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: [forms]
};

export default config;
