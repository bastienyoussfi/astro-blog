import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";
import mdx from "@astrojs/mdx";
import rehypeSlug from "rehype-slug";
import { rehypeHeadingLinks } from "./src/utils/rehypeHeadingLinks.js";
import compress from "astro-compress";

export default defineConfig({
  site: "https://bastienyoussfi.dev",
  output: "static",
  compressHTML: true,
  transitions: false,
  vite: {
    plugins: [tailwindcss()],
    build: {
      minify: true,
      cssMinify: false,
    },
  },
  integrations: [
    react({
      include: ["**/*.tsx", "**/*.jsx"],
    }),
    sitemap({
      filter: (page) => !page.includes("private"),
      changefreq: "weekly",
      priority: 0.7,
      lastmod: new Date(),
      customPages: ["https://bastienyoussfi.dev/custom-page"],
    }),
    icon(),
    mdx(),
    compress({
      img: {
        quality: 80,
      },
      css: true,
      js: true,
      html: true,
    }),
  ],
  markdown: {
    rehypePlugins: [rehypeSlug, rehypeHeadingLinks],
    shikiConfig: {
      theme: "github-dark",
      wrap: true,
      langs: [],
      transformers: [
        {
          pre(node) {
            const lang = node.properties.className?.[0]?.replace(
              /^language-/,
              "",
            );
            if (lang) {
              node.properties["data-language"] = lang;
            }

            const existingClasses = node.properties.className || [];
            node.properties.className = [...existingClasses, "code-block"];
          },
          line(node, line) {
            node.properties.className = ["line"];
            node.children.unshift({
              type: "element",
              tagName: "span",
              properties: { className: ["line-number"] },
              children: [],
            });
          },
          code(node) {
            const content = node.children;
            node.children = [
              {
                type: "element",
                tagName: "div",
                properties: { className: ["astro-code-content"] },
                children: content,
              },
            ];
          },
        },
      ],
    },
  },
});
