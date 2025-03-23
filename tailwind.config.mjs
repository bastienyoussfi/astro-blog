/** @type {import('tailwindcss').Config} */
export default {
  // Purge unused styles by scanning all relevant files
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}"],

  // Enable dark mode using the 'class' strategy
  darkMode: "class",

  // Safelist classes that might be used dynamically (like in components)
  safelist: [
    'text-red-500',
    'text-blue-500',
    'text-green-500',
    'text-yellow-500',
    'text-purple-500',
  ],

  // Plugins
  plugins: [require("@tailwindcss/typography")],
};
