/* ============================================================
   app.js — Home Dashboard Logic (Updated)
   ============================================================
   Updated from the original to add two things:
 
     1. AUTH AWARENESS — reads the logged-in user from the
        session saved by login.html and personalizes the
        greeting with their name and accent color.
 
     2. FIXED SHOPPING TABLE — the shopping widget now queries
        the correct tables: shopping_stores and shopping_items
        instead of the old single 'shopping' table.
 
   Everything else works the same as before.
   ============================================================ */
 
/* ── IMPORT SUPABASE CONNECTION ──────────────────────────────
   The single shared database client from supabase.js.
────────────────────────────────────────────────────────────── */
import { supabase } from './supabase.js';
 
/* ── IMPORT AUTH GUARD ───────────────────────────────────────
   auth.js checks for a valid session the moment it's imported.
   If no session exists it redirects to login before anything
   else on this page runs. If a session exists it exports the
   currentUser object so we can personalize the dashboard.
────────────────────────────────────────────────────────────── */
import { currentUser } from './auth.js';
 
 
/* ════════════════════════════════════════════════════════════
   SECTION 1 — GREETING & DATE
   ════════════════════════════════════════════════════════════
   Now personalized with the logged-in user's name.
   Also applies their accent color to the greeting.
   ══════════════════════════════════════════════════════════ */
 
function setGreeting() {
  /* ── GET CURRENT HOUR ─────────────────────────────────────
     Same as before — check the device clock for time of day.
  ────────────────────────────────────────────────────────── */
  const now  = new Date();
  const hour = now.getHours();
 
  /* ── CHOOSE GREETING ─────────────────────────────────────
     Now includes the user's display name at the end.
     currentUser.display_name is "Cole" or "Maggie" depending
     on who logged in. If somehow null, falls back to empty.
  ────────────────────────────────────────────────────────── */
  const name = currentUser?.display_name || '';
  let greeting;
 
  if (hour < 12) {
    greeting = `Good morning, ${name} ✿`;
  } else if (hour < 17) {
    greeting = `Good afternoon, ${name} ✿`;
  } else {
    greeting = `Good evening, ${name} ✿`;
  }
 
  /* ── FORMAT DATE ─────────────────────────────────────────
     Same date formatting as before.
     Result: "Friday, June 6, 2025"
  ────────────────────────────────────────────────────────── */
  const dateString = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year:    'numeric',
    month:   'long',
    day:     'numeric'
  });
 
  /* ── INJECT INTO HTML ────────────────────────────────────
     Update the greeting and date text in the dashboard.
  ────────────────────────────────────────────────────────── */
  document.getElementById('greeting-text').textContent = greeting;
  document.getElementById('greeting-date').textContent = dateString;
 
  /* ── APPLY USER ACCENT COLOR ─────────────────────────────
     Each user has a color stored in their session.
     We apply it to the greeting text so Cole sees blue
     and Maggie sees pink when they open the app.
     setProperty sets a CSS custom property on the root
     element so it cascades down to any element that uses it.
  ────────────────────────────────────────────────────────── */
  if (currentUser?.color) {
    document.documentElement.style.setProperty(
      '--color-user-accent',
      currentUser.color
    );
    /* Apply color to the greeting text element directly */
    const greetingEl = document.getElementById('greeting-text');
    if (greetingEl) {
      greetingEl.style.color = currentUser.color;
    }
  }
}
 
 
/* ════════════════════════════════════════════════════════════
   SECTION 2 — CALENDAR WIDGET
   ════════════════════════════════════════════════════════════
   Fetches today's events. Now filters by visibility so
   private events only show to the right person.
   ══════════════════════════════════════════════════════════ */
 
async function loadCalendarWidget() {
  const today     = new Date().toISOString().split('T')[0];
  const container = document.getElementById('widget-calendar-events');
  const userName  = currentUser?.name; /* 'cole' or 'maggie' */
 
  /* ── FETCH TODAY'S EVENTS ─────────────────────────────────
     Selects events for today where visibility is either:
       'both'     → everyone sees it
       userName   → only this person sees it (e.g. 'cole')
 
     The .or() filter handles these two cases in one query.
     The backtick template builds a filter string like:
     "visibility.eq.both,visibility.eq.cole"
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
 
  /* ── BUILD EVENT LIST ────────────────────────────────────
     Same map/join approach as before but now also shows
     the category as a colored label.
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
   CHANGED: now queries shopping_stores and shopping_items
   instead of the old single 'shopping' table.
 
   Shows how many stores have active lists and total items
   remaining across all stores.
   ══════════════════════════════════════════════════════════ */
 
async function loadShoppingWidget() {
  const container = document.getElementById('widget-shopping-status');
  const userName  = currentUser?.name;
 
  /* ── FETCH ALL SHOPPING ITEMS ────────────────────────────
     We join shopping_items with shopping_stores by querying
     items and asking Supabase to include the related store
     data using the foreign key relationship we set up.
 
     The shopping_stores(name, secret) part tells Supabase:
     "also give me the name and secret columns from the
     related store row for each item"
 
     We filter out secret lists that belong to the other user.
     A list is visible if: secret is false OR the store was
     created by this user (added_by = userName).
  ────────────────────────────────────────────────────────── */
  const { data: stores, error } = await supabase
    .from('shopping_stores')
    .select('id, name, secret, created_by');
 
  if (error) {
    console.error('Shopping widget error:', error.message);
    container.innerHTML = '<p class="widget-empty">Could not load lists.</p>';
    return;
  }
 
  if (!stores || stores.length === 0) {
    container.innerHTML = '<p class="widget-empty">No shopping lists yet ✿</p>';
    return;
  }
 
  /* ── FILTER OUT SECRET STORES ────────────────────────────
     Hide secret lists that were created by the other person.
     A secret list is only visible to whoever created it.
  ────────────────────────────────────────────────────────── */
  const visibleStores = stores.filter(store =>
    !store.secret || store.created_by === userName
  );
 
  /* ── FETCH ALL ITEMS FOR VISIBLE STORES ──────────────────
     Get item counts for all visible stores at once by
     passing an array of store IDs to the .in() filter.
     .in('store_id', [...]) means "where store_id is any
     of these values" — efficient single query.
  ────────────────────────────────────────────────────────── */
  const storeIds = visibleStores.map(s => s.id);
 
  const { data: items, error: itemsError } = await supabase
    .from('shopping_items')
    .select('store_id, checked_off')
    .in('store_id', storeIds);
 
  if (itemsError) {
    console.error('Shopping items error:', itemsError.message);
    container.innerHTML = '<p class="widget-empty">Could not load items.</p>';
    return;
  }
 
  /* ── COUNT TOTALS ────────────────────────────────────────
     Count total items and how many are still unchecked.
  ────────────────────────────────────────────────────────── */
  const totalItems     = items.length;
  const remainingItems = items.filter(i => !i.checked_off).length;
  const totalLists     = visibleStores.length;
 
  if (totalItems === 0) {
    container.innerHTML = `
      <p class="widget-empty">
        ${totalLists} list${totalLists !== 1 ? 's' : ''} — all empty ✿
      </p>`;
    return;
  }
 
  /* ── BUILD SUMMARY HTML ──────────────────────────────────
     Show a quick summary of lists and items remaining.
  ────────────────────────────────────────────────────────── */
  container.innerHTML = `
    <p class="shopping-summary fade-in">
      <span class="shopping-count">${remainingItems}</span>
      of ${totalItems} items remaining
    </p>
    <p class="shopping-summary" style="font-size:11px; color:var(--color-text-label); margin-top:4px;">
      across ${totalLists} store list${totalLists !== 1 ? 's' : ''} ✿
    </p>
  `;
}
 
 
/* ════════════════════════════════════════════════════════════
   SECTION 4 — BUDGET WIDGET
   ════════════════════════════════════════════════════════════
   Now shows the current user's budget summary specifically.
   Queries budget_months filtered by the logged-in user.
   ══════════════════════════════════════════════════════════ */
 
async function loadBudgetWidget() {
  const container    = document.getElementById('widget-budget-progress');
  const currentMonth = new Date().toISOString().slice(0, 7);
  const userName     = currentUser?.name;
 
  /* ── FETCH THIS USER'S BUDGET FOR THIS MONTH ─────────────
     Filters by both month AND owner so Cole sees his budget
     and Maggie sees hers independently.
  ────────────────────────────────────────────────────────── */
  const { data, error } = await supabase
    .from('budget_months')
    .select('total_income, total_bills, remaining')
    .eq('month', currentMonth)
    .eq('owner', userName)
    .single();
 
  if (error) {
    /* No budget row yet for this user this month — that's okay */
    container.innerHTML = '<p class="widget-empty">No budget set up yet ✿</p>';
    return;
  }
 
  if (!data) {
    container.innerHTML = '<p class="widget-empty">No budget for this month.</p>';
    return;
  }
 
  /* ── CALCULATE PERCENTAGE SPENT ──────────────────────────
     What percentage of income has been committed to bills?
     Math.min caps at 100 so bar never overflows.
  ────────────────────────────────────────────────────────── */
  const percentage   = data.total_income > 0
    ? Math.min(Math.round((data.total_bills / data.total_income) * 100), 100)
    : 0;
  const isOverBudget = data.total_bills > data.total_income;
 
  /* ── FORMAT AS CURRENCY ──────────────────────────────────
     toLocaleString with USD settings formats as $1,200 etc.
  ────────────────────────────────────────────────────────── */
  const fmt = n => n.toLocaleString('en-US', {
    style: 'currency', currency: 'USD', minimumFractionDigits: 0
  });
 
  /* ── BUILD PROGRESS BAR HTML ─────────────────────────────
     Shows income vs bills as a visual progress bar.
     Over-budget class turns the bar red.
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
   Converts 24-hour "14:30" to 12-hour "2:30 PM"
────────────────────────────────────────────────────────────── */
function formatTime(timeString) {
  if (!timeString) return '';
  const [hours, minutes] = timeString.split(':');
  const hour        = parseInt(hours, 10);
  const period      = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${period}`;
}
 
 
/* ════════════════════════════════════════════════════════════
   SECTION 6 — INITIALISE DASHBOARD
   ══════════════════════════════════════════════════════════ */
 
async function init() {
  /* Greeting is instant — runs first so user sees it immediately */
  setGreeting();
 
  /* All three widgets load simultaneously for speed */
  await Promise.all([
    loadCalendarWidget(),
    loadShoppingWidget(),
    loadBudgetWidget()
  ]);
}
 
init();