/**
 * Custom rehype plugin to add anchor links to headings
 * This plugin works after rehype-slug has added IDs to the headings
 */
export function rehypeHeadingLinks() {
  return (tree) => {
    const visit = (node) => {
      // Check if the node is a heading (h1-h6)
      if (
        node.type === "element" &&
        /^h[1-6]$/.test(node.tagName) &&
        node.properties &&
        node.properties.id
      ) {
        // Create an anchor element
        const id = node.properties.id;
        const anchor = {
          type: "element",
          tagName: "a",
          properties: {
            href: `#${id}`,
            class: "heading-link",
            ariaLabel: `Link to section ${id}`,
          },
          children: [
            {
              type: "element",
              tagName: "span",
              properties: { class: "heading-link-icon" },
              children: [{ type: "text", value: "#" }],
            },
          ],
        };

        // Add class to the heading for styling
        const existingClass = node.properties.class || "";
        node.properties.class =
          existingClass + (existingClass ? " " : "") + "heading-with-link";

        // Add the anchor at the beginning of the heading children
        node.children.unshift(anchor);
      }

      // Visit children
      if (node.children) {
        node.children.forEach(visit);
      }
    };

    visit(tree);
  };
}
