# 家族ハブ — Family Hub
## Claude Code Project Context

This file is read automatically by Claude Code every session.
It contains everything needed to understand this project without
any prior conversation history.

---

## What This Is

A Japanese cherry blossom themed family web app for two iPhones
saved to the home screen. Built for a husband and wife to share
a calendar, shopping list, and budget tracker.

---

## Technical Stack

- **Languages:** Vanilla HTML, CSS, JavaScript — no frameworks
- **Database:** Supabase (PostgreSQL in the cloud)
- **Hosting:** GitHub Pages (free, static file hosting)
- **Fonts:** Kaisei Decol (headings), Noto Sans JP (body/UI)
- **No build tools** — files are served directly as written

---

## File Structure

    family-hub/
      index.html        → home dashboard (entry point)
      style.css         → all design variables and styles
      supabase.js       → database connection (imports config.js)
      app.js            → home dashboard logic
      manifest.json     → iPhone PWA install configuration
      config.js         → SECRET — Supabase credentials, never on GitHub
      .gitignore        → tells Git what never to upload
      CLAUDE.md         → this file
      pages/
        calendar.html   → full calendar page (not built yet)
        shopping.html   → full shopping list page (not built yet)
        budget.html     → full budget page (not built yet)
        settings.html   → settings page (not built yet)
      icons/
        apple-touch-icon.png  → 180x180 iPhone home screen icon
        icon-192.png          → 192x192 Android/PWA icon
        icon-512.png          → 512x512 splash screen icon
      images/
        → sakura art, background textures (not added yet)

---

## Design System

### Color Palette (all defined as CSS variables in style.css)
- `--color-cream: #fdf6ee` — main page background
- `--color-sakura-400: #f9a8c9` — primary pink accent
- `--color-sakura-700: #d4537e` — deep pink for text
- `--color-yuzu-400: #fbbf77` — orange accent
- `--color-yuzu-700: #c97a4a` — orange for labels
- `--color-matcha-300: #86efac` — success/done green
- `--color-matcha-600: #34d399` — budget bar green
- `--color-bark-900: #3d2314` — darkest text/headings
- `--color-bark-700: #5a3e2b` — body text
- `--color-bark-500: #8b5e3c` — labels and subtitles

### Typography
- Headings and app title → Kaisei Decol (Japanese serif)
- All UI text and body → Noto Sans JP (clean sans-serif)
- Decorative kana accents scattered throughout UI

### Japanese Kana Widget Labels
- Calendar → カレンダー (karendaa)
- Shopping → 買い物 (kaimono)
- Budget → 予算 (yosan)
- App title → 家族ハブ (kazoku habu = Family Hub)
- Header accent → さくら (sakura = cherry blossom)

---

## Code Style Rules

1. Every code block must have detailed comments explaining
   exactly what each piece does — the owner is learning
   as he builds and comments are how he understands the code
2. Use CSS custom properties (variables) for all colors —
   never hardcode hex values in components
3. Always use semantic variable names, not raw color values
4. iPhone-first — always include:
   - webkit prefixes for Safari
   - 44px minimum tap targets
   - env(safe-area-inset-top/bottom) for notch/home indicator
   - -webkit-tap-highlight-color: transparent on tappable elements
5. JavaScript uses ES Modules (import/export) — no CommonJS
6. All database calls go through the supabase client from supabase.js
7. Never create a second Supabase client anywhere

---

## Database Tables (Supabase — not set up yet)

### events
- id (uuid, primary key)
- title (text) — event name
- date (date) — YYYY-MM-DD format
- time (time) — HH:MM 24-hour format
- created_by (text) — who added it

### shopping
- id (uuid, primary key)
- name (text) — item name
- checked (boolean) — crossed off or not
- added_by (text) — who added it
- created_at (timestamp)

### budget
- id (uuid, primary key)
- month (text) — YYYY-MM format e.g. "2025-06"
- total (numeric) — the monthly budget amount
- spent (numeric) — amount spent so far

---

## Security Model

- config.js is in .gitignore — never uploaded to GitHub
- Supabase Row Level Security (RLS) will be enabled on all tables
- The anon key is safe for client-side use WITH RLS enabled
- Never use the Supabase service_role key in this project

---

## What Is Built So Far

- [x] Git repository initialized and connected to GitHub
- [x] Full file and folder structure created
- [x] index.html — complete home dashboard shell
- [x] style.css — complete design system and all styles
- [x] supabase.js — database connection ready
- [x] app.js — full dashboard logic with all three widgets
- [x] manifest.json — iPhone PWA configuration
- [x] config.js — placeholder credentials (needs real values)
- [x] .gitignore — secrets and system files protected
- [ ] Supabase project created and credentials filled in
- [ ] Row Level Security configured on all tables
- [ ] pages/calendar.html
- [ ] pages/shopping.html
- [ ] pages/budget.html
- [ ] pages/settings.html
- [ ] App icons created and added to icons/
- [ ] GitHub Pages enabled and app live

---

## Next Steps

1. Create Supabase project and fill in config.js credentials
2. Create database tables with the schema above
3. Enable Row Level Security on all tables
4. Enable GitHub Pages in repo settings
5. Build each section page one at a time

## Notes
- Wife's name is [Maggie] — use her name in the greeting widget
- We decided to add a meal planner section in the future