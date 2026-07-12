/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,js,html}"],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#0A0B0F",
          soft: "#0F1117",
          card: "#141821",
        },
        line: "#1F2430",
        text: {
          DEFAULT: "#E7EAF0",
          muted: "#8A93A6",
          dim: "#5A6478",
        },
        accent: {
          DEFAULT: "#7DFFB0",
          strong: "#4CE38E",
        },
        warn: "#FFB84D",
        danger: "#FF5C6B",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        tightest: "-0.04em",
      },
      maxWidth: {
        content: "1180px",
      },
      boxShadow: {
        glow: "0 0 80px -20px rgba(125,255,176,0.35)",
        card: "0 1px 0 rgba(255,255,255,0.04) inset, 0 20px 40px -20px rgba(0,0,0,0.6)",
      },
    },
  },
  plugins: [],
};
