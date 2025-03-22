/** @type {import('tailwindcss').Config} */
export default {
  // Purge unused styles by scanning all relevant files
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}"],

  // Enable dark mode using the 'class' strategy
  darkMode: "class",

  // Plugins
  plugins: [require("@tailwindcss/typography")],
};
