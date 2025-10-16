# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start dev server at localhost:4321
- `npm run build` - Build production site to ./dist/
- `npm run preview` - Preview production build locally
- `npm run format` - Format code with Prettier

### Astro CLI
- `npm run astro` - Run Astro CLI commands (e.g., `npm run astro add react`)

## Project Architecture

### Content-Driven Structure
This is an Astro-based blog with **four content collections** defined in `src/content/config.ts`:

1. **`blog`** - Traditional blog posts (single-level routing: `/blog/[slug]`)
2. **`journeys`** - Master journey metadata for learning paths (e.g., DevOps, ML)
   - Files: `src/content/journeys/{journey-slug}.mdx`
   - Contains: title, description, color theming, goals, progress tracking
3. **`learn`** - Learning posts organized by journey (nested routing: `/learn/[journey]/[slug]`)
   - Each post must specify a `journey` field matching a journey slug
   - Supports: difficulty levels, estimated time, prerequisites, key takeaways, resources
4. **`projects`** - Project showcases also organized by journey (nested routing: `/projects/[slug]`)
   - Includes: tech stack, status, problem statement, key learnings, challenges

### Content Organization
- Content is **strongly typed** using Zod schemas - always respect the schema definitions when adding/editing content
- Journey-based content (`learn` and `projects`) must reference a valid journey slug from the `journeys` collection
- The `journey` field creates the relationship between content and its parent journey

### Key Routing Patterns
- **Blog posts**: `src/pages/blog/[slug].astro` - uses `getStaticPaths()` with `getCollection('blog')`
- **Learn posts**: `src/pages/learn/[journey]/[slug].astro` - two-level dynamic routing with journey parameter
- **Journey indexes**: `src/pages/learn/[journey]/index.astro` - lists all posts for a specific journey

### Component Architecture
- **Astro components** (.astro) - Used for layouts and static UI (server-rendered)
- **React components** (.tsx) - Used only for interactivity with `client:*` directives
  - Located in `src/components/` (e.g., social share buttons, loading bars)
  - **Important**: Only hydrate React components when necessary using appropriate client directives (`client:load`, `client:visible`, etc.)
- **Icon component** (`src/components/Icon.astro`) - Uses astro-icon for consistent iconography with journey-specific icons

### Markdown Processing
Custom markdown pipeline configured in `astro.config.mjs`:
- **Rehype plugins**: `rehype-slug` for heading IDs, custom `rehypeHeadingLinks` for anchor links
- **Shiki syntax highlighting**: GitHub Dark theme with custom transformers
  - Adds line numbers automatically
  - Wraps code blocks in `.code-block` class for styling
  - Adds `data-language` attribute to pre tags

### Styling Strategy
- **Tailwind CSS 4.0** (via Vite plugin) - utility-first approach
- **Global styles**: `src/styles/globals.css` - imported in page templates
- **Typography**: Uses `@tailwindcss/typography` plugin for prose styling (`.prose` class in blog/learn content)
- Dark mode is the default theme throughout the codebase

### SEO & Performance
- **Static output**: Configured as `output: 'static'` for maximum performance
- **Compression**: astro-compress integration for asset optimization
- **Sitemap**: Auto-generated via @astrojs/sitemap with custom filters
- **Structured data**: JSON-LD schema is implemented in blog post pages for SEO
- **Social sharing**: Facebook, LinkedIn, Twitter components for content sharing

### Utilities
- `src/utils/articleUtils.ts`:
  - `formatDate(date)` - Formats dates to "MMM DD" format
  - `getReadingTime(content)` - Calculates reading time (200 words/min)

## Development Philosophy (from .cursor/rules/astro-best-practices.mdc)

### Performance Focus
- Minimize client-side JavaScript - prefer Astro components over React
- Use React `client:*` directives sparingly (only `client:visible`, `client:load` when needed)
- Static-first approach - the site is configured for static generation

### Content Management
- All content uses **Content Collections** with Zod schemas for type safety
- Markdown/MDX for content - MDX allows embedding React components in posts
- Always include required frontmatter: `title`, `date`, `description`

### SEO Best Practices
- Dynamic meta tags in Layout.astro
- Canonical URLs for all pages
- Structured data (JSON-LD) for blog posts
- Sitemap and robots.txt configured

### Code Quality
- TypeScript strict mode enabled (`extends: "astro/tsconfigs/strict"`)
- Format with Prettier before committing
- Keep components modular and organized by feature/domain
