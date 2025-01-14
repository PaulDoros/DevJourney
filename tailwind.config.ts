const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Light theme
        "light-primary": "#ffffff",
        "light-secondary": "#f3f4f6",
        "light-text": "#1f2937",
        "light-accent": "#3b82f6",

        // Dark theme
        "dark-primary": "#1f2937",
        "dark-secondary": "#111827",
        "dark-text": "#f3f4f6",
        "dark-accent": "#60a5fa",

        // Retro theme
        "retro-primary": "#fdf6e3",
        "retro-secondary": "#eee8d5",
        "retro-text": "#586e75",
        "retro-accent": "#cb4b16",

        // Multicolor theme
        "multi-primary": "#2A2F4F",
        "multi-secondary": "#917FB3",
        "multi-text": "#E5BEEC",
        "multi-accent": "#FDE2F3",
        "multi-gradient-1": "#FF0080",
        "multi-gradient-2": "#FF8C00",
        "multi-gradient-3": "#40E0D0",
        "multi-gradient-4": "#7B68EE",
      },
      backgroundImage: {
        "multi-gradient": "linear-gradient(45deg, var(--tw-gradient-stops))",
        "multi-shine":
          "linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.1) 75%, transparent 75%, transparent)",
      },
      animation: {
        gradient: "gradient 8s linear infinite",
        shine: "shine 2s linear infinite",
      },
      keyframes: {
        gradient: {
          "0%, 100%": {
            "background-size": "200% 200%",
            "background-position": "left center",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "right center",
          },
        },
        shine: {
          "0%": { "background-position": "200% 0" },
          "100%": { "background-position": "-200% 0" },
        },
      },
    },
  },
  plugins: [
    plugin(function ({
      addVariant,
    }: {
      addVariant: (name: string, pattern: string) => void;
    }) {
      addVariant("retro", ".retro &");
      addVariant("multi", ".multi &");
    }),
    plugin(function ({
      addUtilities,
    }: {
      addUtilities: (utilities: Record<string, Record<string, string>>) => void;
    }) {
      addUtilities({
        ".multi-card": {
          background: "rgba(255, 255, 255, 0.1)",
          "backdrop-filter": "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          "box-shadow": "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
        },
        ".multi-text-gradient": {
          background:
            "linear-gradient(to right, #00FF7F, #0073FF, #BF1F2F, #849711)",
          "-webkit-background-clip": "text",
          color: "transparent",
          "background-size": "200% auto",
          animation: "gradient 8s linear infinite",
        },
      });
    }),
  ],
};
