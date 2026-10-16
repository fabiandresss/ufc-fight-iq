import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0b0d12",
        panel: "#141821",
        line: "#232938",
        accent: "#f5b942",
        corner: { red: "#ef4444", blue: "#3b82f6" },
      },
    },
  },
  plugins: [],
} satisfies Config;
