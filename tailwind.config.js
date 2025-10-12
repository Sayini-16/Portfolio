/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./themes.ts", // Make sure Tailwind scans your themes file
  ],
  safelist: [
    {
      // This pattern will safelist all `bg-`, `text-`, `border-`, and `hover:text-`
      // classes that use hex colors or tailwind color names.
      pattern: /(bg|text|border|hover:text)-(\w+-)?(\[\#\w+\]|\w+)/,
    },
    // Terminal window buttons
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