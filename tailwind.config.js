/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
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
        surface: "var(--surface)",
        "surface-muted": "var(--surface-muted)",
        "surface-hover": "var(--surface-hover)",
        border: "var(--border)",
        "border-muted": "var(--border-muted)",
        muted: "var(--text-muted)",
        subtle: "var(--text-subtle)",
        overlay: "var(--overlay)",
        "accent-banner": "var(--accent-banner)",
        "accent-banner-foreground": "var(--accent-banner-foreground)",
        "modal-banner": "var(--modal-banner)",
        "modal-title": "var(--modal-title)",
        primary: "var(--primary)",
        "primary-foreground": "var(--primary-foreground)",
        destructive: "var(--destructive)",
        success: "var(--success)",
        "card-flip-back": "var(--card-flip-back)",
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
