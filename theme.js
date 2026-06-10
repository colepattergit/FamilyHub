/* ============================================================
   theme.js — Theme Loader + Themed Dividers
   ============================================================
   UPDATED: now also swaps the branch divider SVG on the home
   page when the theme changes. Each theme has its own unique
   decorative divider in the same style as the original
   cherry blossom branch.

   Import order on every page:
     import '../theme.js';   (or './theme.js' from root)
   ============================================================ */

/* ── THEME DEFINITIONS ───────────────────────────────────────
   Same as before — CSS variable overrides per theme.
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

/* ── THEMED DIVIDER SVGs ─────────────────────────────────────
   Each theme gets its own unique decorative divider SVG.
   All use the same viewBox and dimensions as the original
   cherry blossom branch so they slot in perfectly.

   Colors reference the theme's bark/accent colors using
   hardcoded hex since CSS vars aren't available in SVG
   attributes directly.
────────────────────────────────────────────────────────────── */
const DIVIDERS = {

  /* SAKURA — original cherry blossom branch */
  sakura: `
    <svg viewBox="0 0 375 52" xmlns="http://www.w3.org/2000/svg" width="100%" height="52">
      <path d="M-5 40 Q50 34 100 30 Q155 26 205 28 Q258 30 305 24 Q335 20 380 16"
        fill="none" stroke="#8b5e3c" stroke-width="2" stroke-linecap="round"/>
      <path d="M100 30 Q118 20 140 12" fill="none" stroke="#8b5e3c" stroke-width="1.3" stroke-linecap="round"/>
      <path d="M205 28 Q218 16 235 9" fill="none" stroke="#8b5e3c" stroke-width="1.1" stroke-linecap="round"/>
      <path d="M270 25 Q280 16 290 10" fill="none" stroke="#8b5e3c" stroke-width="0.9" stroke-linecap="round"/>
      <path d="M55 34 Q62 24 72 17" fill="none" stroke="#8b5e3c" stroke-width="0.9" stroke-linecap="round"/>
      <g transform="translate(140,12)">
        <ellipse rx="5" ry="2.8" fill="#f9a8c9" transform="rotate(0) translate(0,-4.5)"/>
        <ellipse rx="5" ry="2.8" fill="#f9a8c9" transform="rotate(72) translate(0,-4.5)"/>
        <ellipse rx="5" ry="2.8" fill="#f9a8c9" transform="rotate(144) translate(0,-4.5)"/>
        <ellipse rx="5" ry="2.8" fill="#f9a8c9" transform="rotate(216) translate(0,-4.5)"/>
        <ellipse rx="5" ry="2.8" fill="#f9a8c9" transform="rotate(288) translate(0,-4.5)"/>
        <circle r="2.2" fill="#fbbf77"/>
      </g>
      <g transform="translate(235,9)">
        <ellipse rx="4.5" ry="2.5" fill="#f9a8c9" transform="rotate(15) translate(0,-4)"/>
        <ellipse rx="4.5" ry="2.5" fill="#f9a8c9" transform="rotate(87) translate(0,-4)"/>
        <ellipse rx="4.5" ry="2.5" fill="#f9a8c9" transform="rotate(159) translate(0,-4)"/>
        <ellipse rx="4.5" ry="2.5" fill="#f9a8c9" transform="rotate(231) translate(0,-4)"/>
        <ellipse rx="4.5" ry="2.5" fill="#f9a8c9" transform="rotate(303) translate(0,-4)"/>
        <circle r="2" fill="#fbbf77"/>
      </g>
      <g transform="translate(290,10)">
        <ellipse rx="4.2" ry="2.2" fill="#fce4ef" transform="rotate(20) translate(0,-3.8)"/>
        <ellipse rx="4.2" ry="2.2" fill="#fce4ef" transform="rotate(92) translate(0,-3.8)"/>
        <ellipse rx="4.2" ry="2.2" fill="#fce4ef" transform="rotate(164) translate(0,-3.8)"/>
        <ellipse rx="4.2" ry="2.2" fill="#fce4ef" transform="rotate(236) translate(0,-3.8)"/>
        <ellipse rx="4.2" ry="2.2" fill="#fce4ef" transform="rotate(308) translate(0,-3.8)"/>
        <circle r="1.8" fill="#fbbf77"/>
      </g>
      <g transform="translate(72,17)">
        <ellipse rx="4" ry="2.2" fill="#f9a8c9" transform="rotate(10) translate(0,-3.5)"/>
        <ellipse rx="4" ry="2.2" fill="#f9a8c9" transform="rotate(82) translate(0,-3.5)"/>
        <ellipse rx="4" ry="2.2" fill="#f9a8c9" transform="rotate(154) translate(0,-3.5)"/>
        <ellipse rx="4" ry="2.2" fill="#f9a8c9" transform="rotate(226) translate(0,-3.5)"/>
        <ellipse rx="4" ry="2.2" fill="#f9a8c9" transform="rotate(298) translate(0,-3.5)"/>
        <circle r="1.8" fill="#fbbf77"/>
      </g>
      <g transform="translate(307,23)">
        <ellipse rx="2.8" ry="4.5" fill="#f9a8c9" transform="rotate(-8)"/>
        <ellipse rx="2.2" ry="3.5" fill="#fce4ef" transform="rotate(8)"/>
      </g>
      <ellipse cx="130" cy="44" rx="4.5" ry="2.2" fill="#f9a8c9" opacity="0.5" transform="rotate(28 130 44)"/>
      <ellipse cx="248" cy="46" rx="4" ry="2" fill="#fce4ef" opacity="0.45" transform="rotate(-18 248 46)"/>
      <ellipse cx="170" cy="48" rx="3.5" ry="1.8" fill="#f9a8c9" opacity="0.35" transform="rotate(45 170 48)"/>
    </svg>
  `,

  /* SUMMER — ocean wave with bubbles and sun */
  summer: `
    <svg viewBox="0 0 375 52" xmlns="http://www.w3.org/2000/svg" width="100%" height="52">
      <!-- Main wave -->
      <path d="M-5 35 Q30 25 60 35 Q90 45 120 35 Q150 25 180 35 Q210 45 240 35 Q270 25 300 35 Q330 45 380 35"
        fill="none" stroke="#164e63" stroke-width="2" stroke-linecap="round"/>
      <!-- Second wave below -->
      <path d="M-5 42 Q30 34 60 42 Q90 50 120 42 Q150 34 180 42 Q210 50 240 42 Q270 34 300 42 Q330 50 380 42"
        fill="none" stroke="#22d3ee" stroke-width="1.2" stroke-linecap="round" opacity="0.6"/>
      <!-- Bubbles rising from wave -->
      <circle cx="45" cy="20" r="4" fill="none" stroke="#22d3ee" stroke-width="1.2" opacity="0.7"/>
      <circle cx="45" cy="10" r="2.5" fill="none" stroke="#22d3ee" stroke-width="1" opacity="0.5"/>
      <circle cx="130" cy="18" r="5" fill="none" stroke="#22d3ee" stroke-width="1.2" opacity="0.7"/>
      <circle cx="135" cy="7" r="3" fill="none" stroke="#22d3ee" stroke-width="1" opacity="0.5"/>
      <circle cx="230" cy="22" r="3.5" fill="none" stroke="#22d3ee" stroke-width="1.2" opacity="0.7"/>
      <circle cx="225" cy="12" r="2" fill="none" stroke="#22d3ee" stroke-width="1" opacity="0.4"/>
      <circle cx="320" cy="19" r="4.5" fill="none" stroke="#22d3ee" stroke-width="1.2" opacity="0.7"/>
      <circle cx="315" cy="8" r="2.5" fill="none" stroke="#22d3ee" stroke-width="1" opacity="0.5"/>
      <!-- Small sun top right -->
      <circle cx="355" cy="12" r="6" fill="none" stroke="#f59e0b" stroke-width="1.5"/>
      <line x1="355" y1="3" x2="355" y2="1" stroke="#f59e0b" stroke-width="1.2" stroke-linecap="round"/>
      <line x1="362" y1="5" x2="363" y2="3" stroke="#f59e0b" stroke-width="1.2" stroke-linecap="round"/>
      <line x1="364" y1="12" x2="366" y2="12" stroke="#f59e0b" stroke-width="1.2" stroke-linecap="round"/>
      <line x1="348" y1="5" x2="347" y2="3" stroke="#f59e0b" stroke-width="1.2" stroke-linecap="round"/>
      <line x1="346" y1="12" x2="344" y2="12" stroke="#f59e0b" stroke-width="1.2" stroke-linecap="round"/>
    </svg>
  `,

  /* AUTUMN — maple branch with falling leaves */
  autumn: `
    <svg viewBox="0 0 375 52" xmlns="http://www.w3.org/2000/svg" width="100%" height="52">
      <!-- Main branch -->
      <path d="M-5 44 Q50 38 100 34 Q155 30 205 32 Q258 34 305 28 Q335 24 380 20"
        fill="none" stroke="#451a03" stroke-width="2" stroke-linecap="round"/>
      <path d="M100 34 Q115 22 132 14" fill="none" stroke="#451a03" stroke-width="1.3" stroke-linecap="round"/>
      <path d="M205 32 Q220 20 238 12" fill="none" stroke="#451a03" stroke-width="1.1" stroke-linecap="round"/>
      <path d="M60 38 Q68 28 78 20" fill="none" stroke="#451a03" stroke-width="0.9" stroke-linecap="round"/>
      <path d="M275 28 Q285 18 295 12" fill="none" stroke="#451a03" stroke-width="0.9" stroke-linecap="round"/>
      <!-- Maple leaf shapes at twig tips — simplified 5-point -->
      <g transform="translate(132,14)">
        <polygon points="0,-8 2,-3 7,-3 3,0 5,6 0,3 -5,6 -3,0 -7,-3 -2,-3" fill="#f87171" opacity="0.9"/>
      </g>
      <g transform="translate(238,12)">
        <polygon points="0,-7 2,-3 6,-3 3,0 4,5 0,3 -4,5 -3,0 -6,-3 -2,-3" fill="#fb923c" opacity="0.9"/>
      </g>
      <g transform="translate(78,20)">
        <polygon points="0,-6 2,-2 5,-2 2,1 4,5 0,3 -4,5 -2,1 -5,-2 -2,-2" fill="#f87171" opacity="0.85"/>
      </g>
      <g transform="translate(295,12)">
        <polygon points="0,-6 2,-2 5,-2 2,1 3,5 0,3 -3,5 -2,1 -5,-2 -2,-2" fill="#fcd34d" opacity="0.85"/>
      </g>
      <!-- Fallen leaves drifting -->
      <g transform="translate(155,42) rotate(25)">
        <polygon points="0,-5 1,-2 4,-2 2,1 3,4 0,2 -3,4 -2,1 -4,-2 -1,-2" fill="#fb923c" opacity="0.5"/>
      </g>
      <g transform="translate(260,46) rotate(-15)">
        <polygon points="0,-4 1,-1 4,-1 2,1 2,4 0,2 -2,4 -2,1 -4,-1 -1,-1" fill="#f87171" opacity="0.4"/>
      </g>
      <g transform="translate(310,44) rotate(40)">
        <polygon points="0,-5 1,-2 4,-2 2,1 3,4 0,2 -3,4 -2,1 -4,-2 -1,-2" fill="#fcd34d" opacity="0.45"/>
      </g>
    </svg>
  `,

  /* WINTER — bare branch with snowflakes */
  winter: `
    <svg viewBox="0 0 375 52" xmlns="http://www.w3.org/2000/svg" width="100%" height="52">
      <!-- Bare branch — no leaves, more angular -->
      <path d="M-5 42 Q50 36 100 32 Q155 28 205 30 Q258 32 305 26 Q335 22 380 18"
        fill="none" stroke="#1e293b" stroke-width="1.8" stroke-linecap="round"/>
      <path d="M100 32 Q115 20 130 12" fill="none" stroke="#1e293b" stroke-width="1.2" stroke-linecap="round"/>
      <path d="M205 30 Q218 18 232 10" fill="none" stroke="#1e293b" stroke-width="1" stroke-linecap="round"/>
      <path d="M58 36 Q66 26 74 18" fill="none" stroke="#1e293b" stroke-width="0.9" stroke-linecap="round"/>
      <path d="M272 26 Q282 16 290 10" fill="none" stroke="#1e293b" stroke-width="0.9" stroke-linecap="round"/>
      <!-- Small twigs — bare branches have more small twigs -->
      <path d="M130 12 Q136 8 140 5" fill="none" stroke="#1e293b" stroke-width="0.7" stroke-linecap="round"/>
      <path d="M130 12 Q124 8 120 6" fill="none" stroke="#1e293b" stroke-width="0.7" stroke-linecap="round"/>
      <path d="M232 10 Q238 6 242 3" fill="none" stroke="#1e293b" stroke-width="0.7" stroke-linecap="round"/>
      <!-- Snowflakes — 6-pointed star shapes -->
      <g transform="translate(155,18)">
        <line x1="0" y1="-6" x2="0" y2="6" stroke="#93c5fd" stroke-width="1.2" stroke-linecap="round"/>
        <line x1="-5.2" y1="-3" x2="5.2" y2="3" stroke="#93c5fd" stroke-width="1.2" stroke-linecap="round"/>
        <line x1="-5.2" y1="3" x2="5.2" y2="-3" stroke="#93c5fd" stroke-width="1.2" stroke-linecap="round"/>
        <circle cx="0" cy="0" r="1.5" fill="#93c5fd"/>
      </g>
      <g transform="translate(260,14)">
        <line x1="0" y1="-5" x2="0" y2="5" stroke="#93c5fd" stroke-width="1" stroke-linecap="round"/>
        <line x1="-4.3" y1="-2.5" x2="4.3" y2="2.5" stroke="#93c5fd" stroke-width="1" stroke-linecap="round"/>
        <line x1="-4.3" y1="2.5" x2="4.3" y2="-2.5" stroke="#93c5fd" stroke-width="1" stroke-linecap="round"/>
        <circle cx="0" cy="0" r="1.2" fill="#93c5fd"/>
      </g>
      <g transform="translate(60,30)">
        <line x1="0" y1="-4" x2="0" y2="4" stroke="#93c5fd" stroke-width="0.9" stroke-linecap="round" opacity="0.7"/>
        <line x1="-3.5" y1="-2" x2="3.5" y2="2" stroke="#93c5fd" stroke-width="0.9" stroke-linecap="round" opacity="0.7"/>
        <line x1="-3.5" y1="2" x2="3.5" y2="-2" stroke="#93c5fd" stroke-width="0.9" stroke-linecap="round" opacity="0.7"/>
      </g>
      <g transform="translate(320,20)">
        <line x1="0" y1="-4.5" x2="0" y2="4.5" stroke="#93c5fd" stroke-width="1" stroke-linecap="round" opacity="0.8"/>
        <line x1="-3.9" y1="-2.25" x2="3.9" y2="2.25" stroke="#93c5fd" stroke-width="1" stroke-linecap="round" opacity="0.8"/>
        <line x1="-3.9" y1="2.25" x2="3.9" y2="-2.25" stroke="#93c5fd" stroke-width="1" stroke-linecap="round" opacity="0.8"/>
      </g>
      <!-- Drifting snowflakes below branch -->
      <circle cx="110" cy="44" r="2" fill="#93c5fd" opacity="0.4"/>
      <circle cx="200" cy="47" r="1.5" fill="#93c5fd" opacity="0.35"/>
      <circle cx="280" cy="45" r="2" fill="#93c5fd" opacity="0.4"/>
    </svg>
  `,

  /* FRANÇAIS — decorative Parisian vine with fleur-de-lis accents */
  francais: `
    <svg viewBox="0 0 375 52" xmlns="http://www.w3.org/2000/svg" width="100%" height="52">
      <!-- Ornate horizontal line with curves -->
      <path d="M10 30 Q50 22 90 30 Q130 38 170 30 Q210 22 250 30 Q290 38 330 30 Q355 24 370 26"
        fill="none" stroke="#1e3a5f" stroke-width="1.5" stroke-linecap="round"/>
      <!-- Decorative curls above the line -->
      <path d="M60 30 Q65 18 70 12 Q75 6 80 10 Q85 14 80 20"
        fill="none" stroke="#1e3a5f" stroke-width="1" stroke-linecap="round"/>
      <path d="M160 30 Q165 18 170 12 Q175 6 180 10 Q185 14 180 20"
        fill="none" stroke="#1e3a5f" stroke-width="1" stroke-linecap="round"/>
      <path d="M260 30 Q265 18 270 12 Q275 6 280 10 Q285 14 280 20"
        fill="none" stroke="#1e3a5f" stroke-width="1" stroke-linecap="round"/>
      <!-- Gold diamond accents at curl bases -->
      <polygon points="70,30 73,26 70,22 67,26" fill="#d4af37" opacity="0.9"/>
      <polygon points="170,30 173,26 170,22 167,26" fill="#d4af37" opacity="0.9"/>
      <polygon points="270,30 273,26 270,22 267,26" fill="#d4af37" opacity="0.9"/>
      <!-- Small fleur-de-lis at top of each curl -->
      <g transform="translate(70,10)">
        <ellipse rx="2" ry="3.5" fill="#1e3a5f"/>
        <ellipse rx="3.5" ry="1.5" fill="#1e3a5f" transform="translate(0,1)"/>
        <ellipse rx="1.2" ry="2" fill="#1e3a5f" transform="translate(-3,2) rotate(-30)"/>
        <ellipse rx="1.2" ry="2" fill="#1e3a5f" transform="translate(3,2) rotate(30)"/>
      </g>
      <g transform="translate(170,10)">
        <ellipse rx="2" ry="3.5" fill="#1e3a5f"/>
        <ellipse rx="3.5" ry="1.5" fill="#1e3a5f" transform="translate(0,1)"/>
        <ellipse rx="1.2" ry="2" fill="#1e3a5f" transform="translate(-3,2) rotate(-30)"/>
        <ellipse rx="1.2" ry="2" fill="#1e3a5f" transform="translate(3,2) rotate(30)"/>
      </g>
      <g transform="translate(270,10)">
        <ellipse rx="2" ry="3.5" fill="#1e3a5f"/>
        <ellipse rx="3.5" ry="1.5" fill="#1e3a5f" transform="translate(0,1)"/>
        <ellipse rx="1.2" ry="2" fill="#1e3a5f" transform="translate(-3,2) rotate(-30)"/>
        <ellipse rx="1.2" ry="2" fill="#1e3a5f" transform="translate(3,2) rotate(30)"/>
      </g>
      <!-- Dotted lower border -->
      <line x1="10" y1="38" x2="365" y2="38" stroke="#d4af37" stroke-width="0.8" stroke-dasharray="3,6" opacity="0.6"/>
    </svg>
  `,

  /* ITALIA — olive branch with olives and grape leaves */
  italia: `
    <svg viewBox="0 0 375 52" xmlns="http://www.w3.org/2000/svg" width="100%" height="52">
      <!-- Main vine branch — more curved and organic -->
      <path d="M-5 38 Q40 32 80 28 Q130 22 175 26 Q225 30 270 22 Q315 14 380 18"
        fill="none" stroke="#5d3a1a" stroke-width="2" stroke-linecap="round"/>
      <!-- Curling vine tendrils -->
      <path d="M80 28 Q90 16 98 10" fill="none" stroke="#5d3a1a" stroke-width="1.2" stroke-linecap="round"/>
      <path d="M175 26 Q185 14 193 8" fill="none" stroke="#5d3a1a" stroke-width="1" stroke-linecap="round"/>
      <path d="M270 22 Q280 12 286 6" fill="none" stroke="#5d3a1a" stroke-width="1" stroke-linecap="round"/>
      <path d="M45 32 Q52 22 58 16" fill="none" stroke="#5d3a1a" stroke-width="0.9" stroke-linecap="round"/>
      <!-- Tendril curls -->
      <path d="M98 10 Q104 6 102 12" fill="none" stroke="#5d3a1a" stroke-width="0.8" stroke-linecap="round"/>
      <path d="M193 8 Q199 4 197 10" fill="none" stroke="#5d3a1a" stroke-width="0.8" stroke-linecap="round"/>
      <!-- Olive leaves — elongated ellipses -->
      <ellipse cx="95" cy="14" rx="7" ry="3" fill="#7daa61" transform="rotate(-30 95 14)" opacity="0.9"/>
      <ellipse cx="103" cy="8" rx="6" ry="2.5" fill="#7daa61" transform="rotate(20 103 8)" opacity="0.85"/>
      <ellipse cx="190" cy="12" rx="7" ry="3" fill="#7daa61" transform="rotate(-25 190 12)" opacity="0.9"/>
      <ellipse cx="197" cy="6" rx="5.5" ry="2.2" fill="#7daa61" transform="rotate(15 197 6)" opacity="0.85"/>
      <ellipse cx="55" cy="20" rx="6" ry="2.5" fill="#7daa61" transform="rotate(-20 55 20)" opacity="0.8"/>
      <ellipse cx="283" cy="10" rx="6" ry="2.5" fill="#7daa61" transform="rotate(-15 283 10)" opacity="0.85"/>
      <!-- Small olives — dark oval berries -->
      <ellipse cx="92" cy="10" rx="2.5" ry="3.5" fill="#c0392b" opacity="0.8"/>
      <ellipse cx="188" cy="8" rx="2.5" ry="3.5" fill="#c0392b" opacity="0.8"/>
      <ellipse cx="280" cy="7" rx="2" ry="3" fill="#7daa61" opacity="0.9"/>
      <!-- Drifting leaves below -->
      <ellipse cx="140" cy="44" rx="5" ry="2" fill="#7daa61" opacity="0.4" transform="rotate(25 140 44)"/>
      <ellipse cx="240" cy="46" rx="4" ry="1.8" fill="#7daa61" opacity="0.35" transform="rotate(-15 240 46)"/>
    </svg>
  `
};

/* ── APPLY SAVED THEME ───────────────────────────────────────
   Runs on every page load. Reads saved theme from localStorage
   and applies CSS variables. Also swaps the divider SVG if
   the branch-divider element exists on this page.
────────────────────────────────────────────────────────────── */
const stored = localStorage.getItem('fh_user');

if (stored) {
  const user       = JSON.parse(stored);
  const themeKey   = `fh_theme_${user.name}`;
  const colorKey   = `fh_color_${user.name}`;
  const savedTheme = localStorage.getItem(themeKey) || 'sakura';
  const savedColor = localStorage.getItem(colorKey) || user.color;

  /* Apply CSS variables */
  const theme = THEMES.find(t => t.id === savedTheme);
  if (theme) {
    Object.entries(theme.colors).forEach(([prop, value]) => {
      document.documentElement.style.setProperty(prop, value);
    });
  }

  /* Apply accent color */
  if (savedColor) {
    document.documentElement.style.setProperty('--color-user-accent', savedColor);
  }

  /* Swap branch divider SVG if element exists on this page
     Only index.html has the branch divider */
  const dividerEl = document.querySelector('.branch-divider');
  if (dividerEl && DIVIDERS[savedTheme]) {
    dividerEl.innerHTML = DIVIDERS[savedTheme];
  }
}

/* ── EXPORT ──────────────────────────────────────────────────
   Export THEMES and DIVIDERS so settings.html can use them
   when the user switches themes — updates divider live.
────────────────────────────────────────────────────────────── */
export { THEMES, DIVIDERS };