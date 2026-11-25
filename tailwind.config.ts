import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Brand = royal blue family ONLY (white + royal blue scheme)
        brand: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        ink: "#0f172a",
      },
      fontFamily: {
        // One font only: Inter (UI_SPEC). `display` is kept as an alias so
        // existing classes render in Inter too — no second typeface.
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        // UI_SPEC: no shadows. Kept as none so legacy classes are inert.
        card: "none",
        drawer: "none",
      },
    },
  },
  plugins: [],
};
export default config;
