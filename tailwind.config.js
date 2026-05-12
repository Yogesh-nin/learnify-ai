/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      keyframes: {
        pulseScale: {
          "0%, 100%": {
            transform: "scale(0)",
            opacity: "0.5",
          },
          "50%": {
            transform: "scale(1)",
            opacity: "1",
          },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(16px) scale(0.97)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" },
        },
      },
      animation: {
        pulseScale: "pulseScale 1s ease-in-out infinite",
        slideUp: "slideUp 0.4s ease-out both",
      },
    },
  },
  plugins: [require("rippleui")],
};
