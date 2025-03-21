# Astro-Vitesse

A modern, fast, and feature-rich boilerplate for building websites with [Astro](https://astro.build), [Tailwind CSS](https://tailwindcss.com), [TypeScript](https://www.typescriptlang.org), and [React](https://reactjs.org).

[![Astro](https://img.shields.io/badge/Astro-5.5.4-orange.svg)](https://astro.build)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0.15-blue.svg)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-Latest-blue.svg)](https://www.typescriptlang.org)
[![React](https://img.shields.io/badge/React-19.0.0-blue.svg)](https://reactjs.org)
[![License](https://img.shields.io/github/license/bastienyoussfi/astro-vitesse?color=success)](https://github.com/bastienyoussfi/astro-vitesse/blob/main/LICENSE)

## 🚀 Features

- ✅ **Astro 5.5** - The web framework for content-driven websites
- ✅ **React 19** - A JavaScript library for building user interfaces
- ✅ **Tailwind CSS 4** - A utility-first CSS framework
- ✅ **TypeScript** - Strongly typed programming language
- ✅ **Sitemap** - Automatic sitemap generation
- ✅ **SEO-friendly** - Optimized for search engines
- ✅ **Optimized** - Fast performance and minimal bundle size
- ✅ **Modern** - Take advantage of the latest web technologies

## 📦 Project Structure

```
/
├── public/             # Static assets
├── src/
│   ├── assets/         # Images and other assets
│   ├── components/     # Reusable UI components
│   ├── content/        # Content collections
│   ├── layouts/        # Page layouts
│   ├── pages/          # Page components and routes
│   └── styles/         # Global styles
├── astro.config.mjs    # Astro configuration
├── tailwind.config.mjs # Tailwind CSS configuration
├── tsconfig.json       # TypeScript configuration
└── package.json        # Project dependencies
```

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command            | Action                                       |
| :----------------- | :------------------------------------------- |
| `npm install`      | Installs dependencies                        |
| `npm run dev`      | Starts local dev server at `localhost:4321`  |
| `npm run build`    | Build your production site to `./dist/`      |
| `npm run preview`  | Preview your build locally before deploying  |
| `npm run astro`    | Run CLI commands like `astro add`            |

## 🛠️ Getting Started

1. **Clone this repository**
   ```bash
   git clone https://github.com/yourusername/astro-vitesse.git my-project
   cd my-project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Visit `http://localhost:4321` to see your site!

## 🔧 Configuration

### Site Configuration

Update the `site` property in `astro.config.mjs` to your own domain:

```js
export default defineConfig({
  site: 'https://yourdomain.com',
  // ...
});
```

### Tailwind CSS

Tailwind CSS is configured in `tailwind.config.mjs`. The project also includes the Typography plugin for styling rich text content.

## 🚀 Deployment

This project is ready to be deployed to your favorite hosting platform:

- [Vercel](https://vercel.com)
- [Netlify](https://netlify.com)
- [GitHub Pages](https://pages.github.com)
- [Cloudflare Pages](https://pages.cloudflare.com)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Astro](https://astro.build) - For the amazing web framework
- [Tailwind CSS](https://tailwindcss.com) - For the utility-first CSS framework
- [React](https://reactjs.org) - For the component-based UI library

---

Feel free to use this template for your next project! If you have any questions or suggestions, please open an issue or submit a pull request.

⭐ Star this repository if you find it useful!
