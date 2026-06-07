/* ============================================================
   app.js — Home Dashboard Logic
   ============================================================
   This is the brain of the home dashboard (index.html).

   WHAT CHANGED IN THIS VERSION:
     1. Shopping widget now shows individual store cards
        instead of a summary. Each card links directly to
        that store's item list in shopping.html?store=ID.

     2. Home page main content area is now scrollable so
        all three widgets are visible even if they expand
        beyond the screen height.

   Everything else (greeting, calendar, budget) unchanged.
   ============================================================ */

/* ── IMPORT SUPABASE CONNECTION ──────────────────────────────
   Single shared database client from supabase.js.
   Every query in this file goes through this one object.
────────────────────────────────────────────────────────────── */
import { supabase } from './supabase.js';

/* ── IMPORT AUTH GUARD ───────────────────────────────────────
   Runs a session check the moment this line executes.
   No session → redirects to login immediately.
   Session exists → exports currentUser for personalization.
────────────────────────────────────────────────────────────── */
import { currentUser } from './auth.js';


/* ════════════════════════════════════════════════════════════
   SECTION 1 — GREETING & DATE
   ════════════════════════════════════════════════════════════
   Checks the device clock and sets a personalized greeting
   with the logged-in user's name and accent color.
   No database needed — runs instantly on page load.
   ══════════════════════════════════════════════════════════ */

function setGreeting() {
  /* ── GET CURRENT HOUR ─────────────────────────────────────
     new Date() = right now as a Date object.
     .getHours() = the current hour as 0-23.
  ────────────────────────────────────────────────────────── */
  const now  = new Date();
  const hour = now.getHours();

  /* ── CHOOSE GREETING BASED ON TIME ──────────────────────
     currentUser?.display_name uses optional chaining (?.)
     which safely returns undefined if currentUser is null,
     instead of throwing an error. The || '' fallback means
     if display_name is undefined, use an empty string.
  ────────────────────────────────────────────────────────── */
  const name = currentUser?.display_name || '';
  let greeting;

  if (hour < 12) {
    greeting = `Good morning, ${name} ✿`;      /* midnight–11:59am */
  } else if (hour < 17) {
    greeting = `Good afternoon, ${name} ✿`;    /* noon–4:59pm */
  } else {
    greeting = `Good evening, ${name} ✿`;      /* 5pm–midnight */
  }

  /* ── FORMAT TODAY'S DATE ─────────────────────────────────
     toLocaleDateString with these options gives:
     "Friday, June 6, 2025"
  ────────────────────────────────────────────────────────── */
  const dateString = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year:    'numeric',
    month:   'long',
    day:     'numeric'
  });

  /* ── INJECT TEXT INTO HTML ───────────────────────────────
     Finds the elements by their id= attributes and sets
     their text content to our greeting and date strings.
  ────────────────────────────────────────────────────────── */
  document.getElementById('greeting-text').textContent = greeting;
  document.getElementById('greeting-date').textContent = dateString;

  /* ── APPLY USER ACCENT COLOR ─────────────────────────────
     Cole sees blue (#7dd3fc), Maggie sees pink (#f9a8c9).
     We apply it to the greeting text as a personal touch.
     setProperty sets a CSS variable on the root element
     so any CSS rule using --color-user-accent picks it up.
  ────────────────────────────────────────────────────────── */
  if (currentUser?.color) {
    document.documentElement.style.setProperty(
      '--color-user-accent',
      currentUser.color
    );
    const greetingEl = document.getElementById('greeting-text');
    if (greetingEl) {
      greetingEl.style.color = currentUser.color;
    }
  }
}


/* ════════════════════════════════════════════════════════════
   SECTION 2 — CALENDAR WIDGET
   ════════════════════════════════════════════════════════════
   Fetches today's events filtered by visibility.
   Private events (cole-only or maggie-only) only show
   to the correct person based on who is logged in.
   ══════════════════════════════════════════════════════════ */

async function loadCalendarWidget() {
  /* Get today's date as YYYY-MM-DD to match database format */
  const today     = new Date().toISOString().split('T')[0];
  const container = document.getElementById('widget-calendar-events');
  const userName  = currentUser?.name; /* 'cole' or 'maggie' */

  /* ── FETCH TODAY'S EVENTS ─────────────────────────────────
     .or() lets us filter by multiple conditions at once.
     We want events where visibility is 'both' OR matches
     the current user's name — so private events only show
     to the right person.
  ────────────────────────────────────────────────────────── */
  const { data, error } = await supabase
    .from('events')
    .select('title, time, category, visibility')
    .eq('date', today)
    .or(`visibility.eq.both,visibility.eq.${userName}`)
    .order('time', { ascending: true });

  if (error) {
    console.error('Calendar widget error:', error.message);
    container.innerHTML = '<p class="widget-empty">Could not load events.</p>';
    return;
  }

  if (data.length === 0) {
    container.innerHTML = '<p class="widget-empty">Nothing scheduled today ✿</p>';
    return;
  }

  /* ── BUILD EVENT LIST HTML ───────────────────────────────
     .map() loops through each event and returns an HTML
     string. .join('') combines them into one string.
  ────────────────────────────────────────────────────────── */
  const eventsHTML = data.map(event => `
    <div class="calendar-event fade-in">
      <div class="calendar-event-dot"></div>
      <span>${formatTime(event.time)} — ${event.title}</span>
    </div>
  `).join('');

  container.innerHTML = eventsHTML;
}


/* ════════════════════════════════════════════════════════════
   SECTION 3 — SHOPPING WIDGET (UPDATED)
   ════════════════════════════════════════════════════════════
   CHANGED: now shows individual store cards instead of
   a text summary. Each card is tappable and links directly
   to that store's item list in shopping.html?store=ID.

   The widget expands to fit all store cards naturally.
   The home page itself scrolls to show everything.
   ══════════════════════════════════════════════════════════ */

async function loadShoppingWidget() {
  const container = document.getElementById('widget-shopping-status');
  const userName  = currentUser?.name;

  /* ── FETCH ALL VISIBLE STORES ────────────────────────────
     Gets all stores then filters out secret lists that
     belong to the other user. Our own secret lists are
     still visible to us.
  ────────────────────────────────────────────────────────── */
  const { data: stores, error } = await supabase
    .from('shopping_stores')
    .select('id, name, secret, created_by')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Shopping widget error:', error.message);
    container.innerHTML = '<p class="widget-empty">Could not load lists.</p>';
    return;
  }

  /* Filter out other person's secret lists */
  const visibleStores = (stores || []).filter(store =>
    !store.secret || store.created_by === userName
  );

  if (visibleStores.length === 0) {
    container.innerHTML = '<p class="widget-empty">No shopping lists yet ✿</p>';
    return;
  }

  /* ── FETCH ITEM COUNTS FOR ALL STORES ────────────────────
     Single query gets all items across all visible stores.
     We then group and count them in JavaScript rather than
     making a separate query for each store — much faster.
  ────────────────────────────────────────────────────────── */
  const storeIds = visibleStores.map(s => s.id);

  const { data: items } = await supabase
    .from('shopping_items')
    .select('store_id, checked_off')
    .in('store_id', storeIds);

  /* ── BUILD COUNT MAP ─────────────────────────────────────
     Creates an object like:
     {
       1: { total: 5, remaining: 3 },
       2: { total: 8, remaining: 8 },
     }
     Keys are store IDs — lets us look up counts instantly
     when building each card's HTML below.
  ────────────────────────────────────────────────────────── */
  const countMap = {};
  (items || []).forEach(item => {
    if (!countMap[item.store_id]) {
      countMap[item.store_id] = { total: 0, remaining: 0 };
    }
    countMap[item.store_id].total++;
    if (!item.checked_off) countMap[item.store_id].remaining++;
  });

  /* ── BUILD STORE CARD HTML ───────────────────────────────
     Each store gets a mini card inside the widget.
     Tapping the card navigates to shopping.html?store=ID
     which opens that store's item list directly.

     The card shows:
       - Store name
       - Item count (e.g. "3 of 7 items remaining")
       - Secret badge if it's a private list
       - A › arrow on the right
  ────────────────────────────────────────────────────────── */
  const cardsHTML = visibleStores.map(store => {
    const counts = countMap[store.id] || { total: 0, remaining: 0 };

    /* Build the count text based on how many items exist */
    let countText;
    if (counts.total === 0) {
      countText = 'Empty — tap to add items';
    } else if (counts.remaining === 0) {
      countText = `All ${counts.total} items checked off ✓`;
    } else {
      countText = `${counts.remaining} of ${counts.total} remaining`;
    }

    return `
      <a
        class="widget-store-card"
        href="pages/shopping.html?store=${store.id}"
      >
        <div class="widget-store-card-left">
          <span class="widget-store-name">${store.name}</span>
          <span class="widget-store-count">${countText}</span>
        </div>
        <div class="widget-store-card-right">
          ${store.secret ? '<span class="widget-secret-badge">🤫</span>' : ''}
          <span class="widget-store-arrow">›</span>
        </div>
      </a>
    `;
  }).join('');

  /* ── ADD VIEW ALL LINK ───────────────────────────────────
     Below the store cards, a link to the full shopping page
     where new lists can be created and all lists managed.
  ────────────────────────────────────────────────────────── */
  container.innerHTML = `
    <div class="widget-store-list">
      ${cardsHTML}
    </div>
    <a class="widget-view-all-btn" href="pages/shopping.html">
      Manage Lists →
    </a>
  `;
}


/* ════════════════════════════════════════════════════════════
   SECTION 4 — BUDGET WIDGET
   ════════════════════════════════════════════════════════════
   Shows the logged-in user's budget summary for this month.
   Queries budget_months filtered by owner and current month.
   ══════════════════════════════════════════════════════════ */

async function loadBudgetWidget() {
  const container    = document.getElementById('widget-budget-progress');
  const currentMonth = new Date().toISOString().slice(0, 7);
  /* .slice(0,7) cuts "2025-06-06T..." down to "2025-06" */
  const userName     = currentUser?.name;

  /* ── FETCH THIS USER'S BUDGET ROW ────────────────────────
     .single() returns one object instead of an array.
     If no row exists for this month it returns an error
     which we catch below and show a friendly message.
  ────────────────────────────────────────────────────────── */
  const { data, error } = await supabase
    .from('budget_months')
    .select('total_income, total_bills, remaining')
    .eq('month', currentMonth)
    .eq('owner', userName)
    .single();

  if (error) {
    container.innerHTML = '<p class="widget-empty">No budget set up yet ✿</p>';
    return;
  }

  if (!data) {
    container.innerHTML = '<p class="widget-empty">No budget for this month.</p>';
    return;
  }

  /* ── CALCULATE PERCENTAGE ────────────────────────────────
     How much of income is going to bills?
     Math.min caps at 100 so bar never overflows visually.
  ────────────────────────────────────────────────────────── */
  const percentage   = data.total_income > 0
    ? Math.min(Math.round((data.total_bills / data.total_income) * 100), 100)
    : 0;
  const isOverBudget = data.total_bills > data.total_income;

  /* ── FORMAT AS CURRENCY ──────────────────────────────────
     Arrow function shorthand for formatting numbers as USD.
     fmt(1300) → "$1,300"
  ────────────────────────────────────────────────────────── */
  const fmt = n => n.toLocaleString('en-US', {
    style: 'currency', currency: 'USD', minimumFractionDigits: 0
  });

  /* ── BUILD PROGRESS BAR ──────────────────────────────────
     Visual bar showing bills vs income.
     Turns red if bills exceed income (over budget).
  ────────────────────────────────────────────────────────── */
  container.innerHTML = `
    <div class="budget-bar-wrap fade-in">
      <div class="budget-bar-fill ${isOverBudget ? 'over-budget' : ''}"
           style="width: ${percentage}%">
      </div>
    </div>
    <div class="budget-labels">
      <span>${fmt(data.total_bills)} bills</span>
      <span>${fmt(data.total_income)} income</span>
    </div>
  `;
}


/* ════════════════════════════════════════════════════════════
   SECTION 5 — HELPER FUNCTIONS
   ══════════════════════════════════════════════════════════ */

/* ── FORMAT TIME ─────────────────────────────────────────────
   Converts 24-hour "14:30" to 12-hour "2:30 PM".
   Used by the calendar widget to display event times.

   Input:  "14:30"
   Output: "2:30 PM"
────────────────────────────────────────────────────────────── */
function formatTime(timeString) {
  if (!timeString) return '';
  const [hours, minutes] = timeString.split(':');
  const hour        = parseInt(hours, 10);
  const period      = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  /* hour % 12 converts 13→1, 14→2 etc.
     || 12 handles midnight (0 % 12 = 0, we want 12) */
  return `${displayHour}:${minutes} ${period}`;
}


/* ════════════════════════════════════════════════════════════
   SECTION 6 — INITIALISE DASHBOARD
   ════════════════════════════════════════════════════════════
   Entry point — called once when the page loads.
   Sets greeting instantly, then loads all three widgets
   simultaneously using Promise.all for maximum speed.
   ══════════════════════════════════════════════════════════ */

async function init() {
  /* Greeting needs no database so it runs first — instant */
  setGreeting();

  /* Promise.all fires all three fetches at the same time.
     Total wait time = slowest single request, not all three added.
     ~300ms instead of ~900ms if they ran one after another. */
  await Promise.all([
    loadCalendarWidget(),
    loadShoppingWidget(),
    loadBudgetWidget()
  ]);
}

init();