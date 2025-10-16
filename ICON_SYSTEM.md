# Icon System

## Overview

Clean, SVG-based icon system that replaces emojis for a more professional look. Icons are:
- **Consistent size** - Always the correct dimensions
- **Easy to swap** - Just replace the SVG file
- **Customizable** - SVG icons inherit text color with `stroke="currentColor"`
- **Optimized** - Lazy loaded and accessible

## Usage

### Basic Usage

```astro
import Icon from '../components/Icon.astro';

<!-- Predefined icon by name -->
<Icon name="rocket" size="md" />

<!-- Custom image -->
<Icon src="/images/custom-icon.svg" alt="Custom" size="lg" />

<!-- With additional classes -->
<Icon name="book" size="sm" class="text-blue-500" />
```

### Available Sizes

- `xs` - 16px (inline text icons)
- `sm` - 20px (small badges, tags)
- `md` - 24px (default, section headers)
- `lg` - 32px (page headers)
- `xl` - 48px (hero sections)

### Predefined Icons

Located in `public/images/icons/`:

**Journey Icons:**
- `rocket` / `devops` - DevOps journey
- `brain` / `ml` / `machine-learning` - ML journey

**Section Icons:**
- `target` - Goals, key takeaways
- `lightbulb` - Key learnings, ideas
- `bolt` - Challenges, quick wins
- `book` - Resources, articles, docs
- `graduation` - Learn section, courses
- `trophy` - Achievements

**Resource Type Icons:**
- `course` - Educational courses
- `article` - Articles and documentation
- `tool` - Tools and utilities
- `video` - Video content

## Adding New Icons

1. **Find an icon** - Use [Lucide Icons](https://lucide.dev) or [Heroicons](https://heroicons.com)
2. **Save SVG** - Place in `public/images/icons/your-icon.svg`
3. **Use `stroke="currentColor"`** - So it inherits text color
4. **Add to mapping** (optional) - Edit `src/components/Icon.astro`:

```typescript
const iconMap: Record<string, string> = {
  'your-icon': '/images/icons/your-icon.svg',
  // ...
};
```

## SVG Template

Use this template for consistent icons:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <!-- Your paths here -->
</svg>
```

Key attributes:
- `fill="none"` - Outlined style
- `stroke="currentColor"` - Inherits text color
- `stroke-width="2"` - Consistent line weight
- `viewBox="0 0 24 24"` - Standard size

## Replacing Emojis

### Before
```astro
<h1>🚀 Projects</h1>
<span>📚 Resources</span>
```

### After
```astro
<h1 class="flex items-center gap-3">
  <Icon name="rocket" size="xl" />
  Projects
</h1>
<span class="flex items-center gap-2">
  <Icon name="book" size="sm" />
  Resources
</span>
```

## Benefits

✅ **Professional** - No AI-generated emoji vibe  
✅ **Consistent** - Always the right size  
✅ **Themeable** - Icons match your color scheme  
✅ **Accessible** - Proper alt text  
✅ **Fast** - SVG icons are tiny and lazy-loaded  
✅ **Easy to change** - Just swap the SVG file  

## Color Customization

Icons inherit the text color:

```astro
<Icon name="rocket" class="text-blue-500" />
<Icon name="lightbulb" class="text-yellow-400" />
<Icon name="target" class="text-green-500" />
```

Or use Tailwind modifiers:

```astro
<div class="hover:text-blue-400">
  <Icon name="book" /> <!-- Icon color changes on hover -->
</div>
```
