/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // Removed aggressive safelist - we now use inline styles for theme colors
  // This should reduce CSS from ~3.5MB to ~50KB
  safelist: [
    // Traffic light buttons in TerminalHeader
    'bg-red-500',
    'bg-yellow-500',
    'bg-green-500',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: 'var(--primary)',
      },
    },
  },
  plugins: [],
}
