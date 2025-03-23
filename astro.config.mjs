import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";

export default defineConfig({
  site: "https://example.com",
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [react(), sitemap(), icon()],
  markdown: {
    shikiConfig: {
      // Choose from Shiki's built-in themes
      theme: 'github-dark',
      // Enable word wrap to prevent horizontal scrolling
      wrap: false,
      // Add custom language aliases
      langs: [],
      // Customize the line numbers and container
      transformers: [
        {
          pre(node) {
            // Add a data-language attribute for our CSS to target
            const lang = node.properties.className?.[0]?.replace(/^language-/, '');
            if (lang) {
              node.properties['data-language'] = lang;
            }
            
            // Add CSS classes for styling
            const existingClasses = node.properties.className || [];
            node.properties.className = [...existingClasses, 'code-block'];
          },
          line(node, line) {
            // Add a 'line' class to each line for styling
            node.properties.className = ['line'];
            node.children.unshift({
              type: 'element',
              tagName: 'span',
              properties: { className: ['line-number'] },
              children: []
            });
          },
          // Wrap code content in a container for padding
          code(node) {
            const content = node.children;
            node.children = [
              {
                type: 'element',
                tagName: 'div',
                properties: { className: ['astro-code-content'] },
                children: content
              }
            ];
          }
        }
      ]
    }
  }
});
