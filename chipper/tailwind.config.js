// tailwind.config.js - E-commerce optimized theme
import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
const tailwindConfig = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        emerald: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: "var(--font-mono)",
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'bounce-in': 'bounceIn 0.6s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceIn: {
          '0%, 20%, 40%, 60%, 80%': {
            transform: 'scale(0.95)',
            opacity: '0.7',
          },
          '100%': {
            transform: 'scale(1)',
            opacity: '1',
          },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'glow': '0 0 20px rgba(16, 185, 129, 0.3)',
        'glow-lg': '0 0 30px rgba(16, 185, 129, 0.4)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        chipperLight: {
          // Primary colors - Emerald/Green for e-commerce trust
          "primary": "#10b981",           // Emerald-500
          "primary-focus": "#059669",     // Emerald-600
          "primary-content": "#ffffff",   // White text on primary
          
          // Secondary colors - Blue for professionalism
          "secondary": "#3b82f6",         // Blue-500
          "secondary-focus": "#2563eb",   // Blue-600
          "secondary-content": "#ffffff", // White text on secondary
          
          // Accent colors - Amber for urgency/highlights
          "accent": "#f59e0b",           // Amber-500
          "accent-focus": "#d97706",     // Amber-600
          "accent-content": "#ffffff",   // White text on accent
          
          // Neutral colors - Gray scale
          "neutral": "#374151",          // Gray-700
          "neutral-focus": "#1f2937",    // Gray-800
          "neutral-content": "#ffffff",  // White text on neutral
          
          // Base colors - Light backgrounds
          "base-100": "#ffffff",         // White
          "base-200": "#f9fafb",        // Gray-50
          "base-300": "#f3f4f6",        // Gray-100
          "base-content": "#111827",    // Gray-900 (text)
          
          // State colors
          "info": "#3b82f6",            // Blue-500
          "success": "#10b981",         // Emerald-500
          "warning": "#f59e0b",         // Amber-500
          "error": "#ef4444",           // Red-500
          
          // Additional utility
          "--rounded-box": "1rem",       // Border radius for cards
          "--rounded-btn": "0.5rem",     // Border radius for buttons
          "--rounded-badge": "1.9rem",   // Border radius for badges
          "--animation-btn": "0.25s",    // Button animation duration
          "--animation-input": "0.2s",   // Input animation duration
          "--btn-text-case": "uppercase",// Button text transform
          "--btn-focus-scale": "0.95",   // Button scale on focus
          "--border-btn": "1px",         // Button border width
          "--tab-border": "1px",         // Tab border width
          "--tab-radius": "0.5rem",      // Tab border radius
        },
        chipperDark: {
          // Optional dark theme for future use
          "primary": "#10b981",
          "primary-focus": "#059669",
          "primary-content": "#ffffff",
          
          "secondary": "#3b82f6",
          "secondary-focus": "#2563eb",
          "secondary-content": "#ffffff",
          
          "accent": "#f59e0b",
          "accent-focus": "#d97706",
          "accent-content": "#000000",
          
          "neutral": "#1f2937",
          "neutral-focus": "#111827",
          "neutral-content": "#f9fafb",
          
          "base-100": "#111827",
          "base-200": "#1f2937",
          "base-300": "#374151",
          "base-content": "#f9fafb",
          
          "info": "#3b82f6",
          "success": "#10b981",
          "warning": "#f59e0b",
          "error": "#ef4444",
        },
      },
      "light",    // Built-in light theme as fallback
      "dark",     // Built-in dark theme as fallback
      "cupcake",  // Additional DaisyUI themes
      "emerald",
      "corporate",
    ],
    darkTheme: "chipperDark",  // Use chipperDark for dark mode
    base: true,                 // Apply base styles
    styled: true,               // Apply component styles
    utils: true,                // Apply utility classes
    rtl: false,                 // Right-to-left support
    prefix: "",                 // No prefix for DaisyUI classes
    logs: false,                // Disable DaisyUI console logs
  },
};

export default tailwindConfig;