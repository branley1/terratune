/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1e463a",
        secondary: "#102a2a",
        tertiary: "#0a1417",
        accent: { // Assuming emerald-500 is the intended accent
          DEFAULT: '#4ade80',
          '50': '#ecfdf5',
          '100': '#d1fae5',
          '200': '#a7f3d0',
          '300': '#6ee7b7',
          '400': '#34d399',
          '500': '#10b981',
          '600': '#059669',
          '700': '#047857',
          '800': '#065f46',
          '900': '#064e3b',
          '950': '#022c22',
        },
        sidebarBg: "rgba(0, 0, 0, 0.4)",
        lightText: "rgba(255, 255, 255, 0.7)",
        mutedText: "rgba(255, 255, 255, 0.5)",
        emerald: {
          300: '#6ee7b7',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a'
        },
        black: '#000000'
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, var(--tw-gradient-stops))',
        'app-gradient': 'linear-gradient(to bottom right, var(--tw-gradient-stops))',
      },
      fontFamily: {
        sans: ['"PT Sans"', 'sans-serif'],
        brand: ['"Baloo 2"', 'cursive'],
      },
      keyframes: {
        fall: {
          '0%': { transform: 'translateY(-10vh) rotate(0deg) translateX(0vw)', opacity: '0.6' },
          '50%': { transform: 'rotate(180deg) translateX(2vw)', opacity: '0.8' },
          '100%': { transform: 'translateY(110vh) rotate(360deg) translateX(-2vw)', opacity: '0' },
        },
      },
      animation: {
        fall: 'fall 15s linear infinite',
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
} 