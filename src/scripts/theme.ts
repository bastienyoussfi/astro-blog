/**
 * Theme management script
 * Handles theme detection, persistence, and application
 */

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';

/**
 * Get the current theme from localStorage or system preference
 */
export function getTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';

  const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;

  if (stored === 'light' || stored === 'dark') {
    return stored;
  }

  // Detect system preference
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Apply theme to the document
 */
export function applyTheme(theme: Theme): void {
  const root = document.documentElement;

  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }

  localStorage.setItem(STORAGE_KEY, theme);
}

/**
 * Toggle between light and dark theme
 */
export function toggleTheme(): Theme {
  const current = getTheme();
  const next: Theme = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  return next;
}

/**
 * Initialize theme (to be called immediately on page load)
 * This prevents flash of unstyled content (FOUC)
 */
export function initTheme(): void {
  const theme = getTheme();
  applyTheme(theme);
}

/**
 * Listen for system theme changes
 */
export function watchSystemTheme(): void {
  if (typeof window === 'undefined') return;

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  mediaQuery.addEventListener('change', (e) => {
    // Only auto-switch if user hasn't manually set a preference
    if (!localStorage.getItem(STORAGE_KEY)) {
      applyTheme(e.matches ? 'dark' : 'light');

      // Dispatch custom event for components to react
      window.dispatchEvent(new CustomEvent('themechange', {
        detail: { theme: e.matches ? 'dark' : 'light' }
      }));
    }
  });
}
