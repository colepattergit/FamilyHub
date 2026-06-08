/* ============================================================
   theme.js — Theme Loader
   ============================================================
   This file is imported by every page in the app.
   It runs one job on page load:

     Read the saved theme from localStorage for the current
     user and apply all its CSS variable overrides instantly.

   This means when you switch to the Autumn theme in settings
   and then navigate to the shopping page, the shopping page
   also shows in Autumn theme automatically.

   HOW IT WORKS:
   All themes are defined as objects with CSS variable
   overrides. We read which theme is saved for this user,
   find that theme's definition, and apply each variable
   to the document root element. CSS custom properties
   cascade down to every element automatically.

   IMPORT ORDER:
   This file should be imported BEFORE auth.js on each page
   so the theme applies before any content renders, preventing
   a flash of the default theme.
   ============================================================ */

/* ── THEME DEFINITIONS ───────────────────────────────────────
   Same definitions as settings.html — kept in sync.
   Each theme has an id and a colors object of CSS variables.
────────────────────────────────────────────────────────────── */
const THEMES = [
  {
    id: 'sakura',
    particle: 'theme-sakura',
    colors: {
      '--color-cream':      '#fdf6ee',
      '--color-bg-page':    '#fdf6ee',
      '--color-sakura-400': '#f9a8c9',
      '--color-yuzu-700':   '#c97a4a',
      '--color-bark-900':   '#3d2314',
      '--color-bg-nav':     'rgba(253, 246, 238, 0.85)',
      '--color-bg-card':    '#ffffff',
    }
  },
  {
    id: 'summer',
    particle: 'theme-summer',
    colors: {
      '--color-cream':      '#f0f9ff',
      '--color-bg-page':    '#f0f9ff',
      '--color-sakura-400': '#22d3ee',
      '--color-yuzu-700':   '#f59e0b',
      '--color-bark-900':   '#164e63',
      '--color-bg-nav':     'rgba(240, 249, 255, 0.85)',
      '--color-bg-card':    '#ffffff',
    }
  },
  {
    id: 'autumn',
    particle: 'theme-autumn',
    colors: {
      '--color-cream':      '#fef3c7',
      '--color-bg-page':    '#fef3c7',
      '--color-sakura-400': '#f87171',
      '--color-yuzu-700':   '#fb923c',
      '--color-bark-900':   '#451a03',
      '--color-bg-nav':     'rgba(254, 243, 199, 0.85)',
      '--color-bg-card':    '#ffffff',
    }
  },
  {
    id: 'winter',
    particle: 'theme-winter',
    colors: {
      '--color-cream':      '#f1f5f9',
      '--color-bg-page':    '#f1f5f9',
      '--color-sakura-400': '#93c5fd',
      '--color-yuzu-700':   '#64748b',
      '--color-bark-900':   '#1e293b',
      '--color-bg-nav':     'rgba(241, 245, 249, 0.85)',
      '--color-bg-card':    '#ffffff',
    }
  },
  {
    id: 'francais',
    particle: 'theme-francais',
    colors: {
      '--color-cream':      '#fefce8',
      '--color-bg-page':    '#fefce8',
      '--color-sakura-400': '#1e3a5f',
      '--color-yuzu-700':   '#d4af37',
      '--color-bark-900':   '#1e3a5f',
      '--color-bg-nav':     'rgba(254, 252, 232, 0.85)',
      '--color-bg-card':    '#ffffff',
    }
  },
  {
    id: 'italia',
    particle: 'theme-italia',
    colors: {
      '--color-cream':      '#fef9f0',
      '--color-bg-page':    '#fef9f0',
      '--color-sakura-400': '#c0392b',
      '--color-yuzu-700':   '#e67e22',
      '--color-bark-900':   '#5d3a1a',
      '--color-bg-nav':     'rgba(254, 249, 240, 0.85)',
      '--color-bg-card':    '#ffffff',
    }
  }
];

/* ── APPLY SAVED THEME ───────────────────────────────────────
   Read the current user from localStorage, then read their
   saved theme preference, then apply it.

   We read currentUser directly from localStorage here rather
   than importing from auth.js to avoid circular imports and
   ensure theme applies before auth redirect logic runs.
────────────────────────────────────────────────────────────── */
const stored = localStorage.getItem('fh_user');

if (stored) {
  /* Parse the user object from localStorage */
  const user = JSON.parse(stored);

  /* Read this user's saved theme — default to sakura */
  const themeKey   = `fh_theme_${user.name}`;
  const colorKey   = `fh_color_${user.name}`;
  const savedTheme = localStorage.getItem(themeKey) || 'sakura';
  const savedColor = localStorage.getItem(colorKey) || user.color;

  /* Find the theme definition */
  const theme = THEMES.find(t => t.id === savedTheme);

  if (theme) {
    /* Apply each CSS variable override to the root element
       document.documentElement is the <html> element —
       CSS custom properties set here cascade to everything */
    Object.entries(theme.colors).forEach(([prop, value]) => {
      document.documentElement.style.setProperty(prop, value);
    });
  }

  /* Apply the user's accent color */
  if (savedColor) {
    document.documentElement.style.setProperty('--color-user-accent', savedColor);
  }
}

/* ── EXPORT THEME HELPERS ────────────────────────────────────
   Export the THEMES array so other files can import it
   if they need to reference theme definitions.
────────────────────────────────────────────────────────────── */
export { THEMES };