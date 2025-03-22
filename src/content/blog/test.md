---
title: "Async, Sync, in Between"
date: 2025-03-21
description: "A minimal blog post built with Astro."
readingTime: " min"
---

# 

## Second test

In modern programming, the function coloring problem isn’t new. Based on how functions execute: synchronous (blocking) and asynchronous (non-blocking), we often classify them into two "colors" for better distinction. The problem arises because you generally cannot mix and match these ```colors``` freely.

```js
export function markdownToHtml(markdown) {
  const ast = parse(markdown)
  // ...
  return render(ast)
}
```