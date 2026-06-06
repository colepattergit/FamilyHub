/* ============================================================
   app.js — Home Dashboard Logic
   ============================================================
   This file is the BRAIN of the home dashboard (index.html).
   It runs automatically when index.html loads and does three
   things:

     1. Sets the greeting and date in the header banner
     2. Fetches today's calendar events from Supabase
     3. Fetches shopping list status from Supabase
     4. Fetches budget progress from Supabase

   Each section injects its result directly into the widget
   cards we built in index.html using the id= attributes we
   put on each widget body.

   IMPORTANT CONCEPT — async/await:
   Talking to a database takes time — the app has to send a
   request over the internet and wait for a response. We use
   async/await to handle this waiting cleanly without freezing
   the whole page. Think of it like placing a food order:
     - async marks a function as "this will involve waiting"
     - await means "pause here until the response comes back"
     - while waiting, the rest of the page stays interactive
   ============================================================ */

/* ── IMPORT THE SUPABASE CONNECTION ─────────────────────────
   We pull in the single supabase client we created in
   supabase.js. Every database call in this file goes through
   this one imported object. We never create a second client.
────────────────────────────────────────────────────────────── */
import { supabase } from './supabase.js';


/* ════════════════════════════════════════════════════════════
   SECTION 1 — GREETING & DATE
   ════════════════════════════════════════════════════════════
   Runs immediately when the page loads. Checks the current
   hour and sets an appropriate greeting, then formats today's
   date in a readable way and injects both into the HTML.
   No database needed for this — it uses the device clock.
   ══════════════════════════════════════════════════════════ */

function setGreeting() {
  /* ── GET CURRENT HOUR ─────────────────────────────────────
     new Date() creates a Date object representing right now.
     .getHours() returns the hour as a number 0-23.
     0  = midnight, 12 = noon, 17 = 5pm, 23 = 11pm
  ────────────────────────────────────────────────────────── */
  const now = new Date();
  const hour = now.getHours();

  /* ── CHOOSE GREETING BASED ON TIME OF DAY ────────────────
     A simple if/else ladder that picks the right greeting.
     The ✿ is a Japanese flower symbol — fits our aesthetic.
  ────────────────────────────────────────────────────────── */
  let greeting;
  if (hour < 12) {
    greeting = 'Good morning ✿';       /* midnight to 11:59am */
  } else if (hour < 17) {
    greeting = 'Good afternoon ✿';     /* noon to 4:59pm */
  } else {
    greeting = 'Good evening ✿';       /* 5pm to midnight */
  }

  /* ── FORMAT TODAY'S DATE ─────────────────────────────────
     toLocaleDateString() converts a Date object to a readable
     string. The options object controls the format:
       weekday: 'long'  → "Friday"
       year: 'numeric'  → "2025"
       month: 'long'    → "June"
       day: 'numeric'   → "6"
     Result looks like: "Friday, June 6, 2025"
  ────────────────────────────────────────────────────────── */
  const dateString = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  /* ── INJECT INTO THE HTML ────────────────────────────────
     document.getElementById() finds the element on the page
     with that exact id= attribute. We set its textContent
     to our greeting and date strings.

     These two elements are in index.html:
       <p id="greeting-text">  → receives the greeting
       <p id="greeting-date">  → receives the date
  ────────────────────────────────────────────────────────── */
  document.getElementById('greeting-text').textContent = greeting;
  document.getElementById('greeting-date').textContent = dateString;
}


/* ════════════════════════════════════════════════════════════
   SECTION 2 — CALENDAR WIDGET
   ════════════════════════════════════════════════════════════
   Fetches events from the Supabase 'events' table where the
   date matches today. Injects them as a list into the
   calendar widget card on the dashboard.

   async keyword → this function contains awaits (it waits
   for database responses before continuing)
   ══════════════════════════════════════════════════════════ */

async function loadCalendarWidget() {
  /* ── GET TODAY'S DATE AS A STRING ────────────────────────
     We need today's date in YYYY-MM-DD format to match how
     dates are stored in Supabase (e.g. "2025-06-06").
     toISOString() gives us "2025-06-06T12:00:00.000Z"
     .split('T')[0] cuts off everything after the T
     leaving just "2025-06-06"
  ────────────────────────────────────────────────────────── */
  const today = new Date().toISOString().split('T')[0];

  /* ── FIND THE WIDGET ELEMENT ─────────────────────────────
     This is the <div id="widget-calendar-events"> in index.html
     We will inject our content into this element.
  ────────────────────────────────────────────────────────── */
  const container = document.getElementById('widget-calendar-events');

  /* ── FETCH EVENTS FROM SUPABASE ──────────────────────────
     This is our first real database call. Breaking it down:

     supabase.from('events')
       → target the 'events' table in our database

     .select('title, time')
       → only fetch the title and time columns
         (not every column — keeps the response small)

     .eq('date', today)
       → only rows where the date column equals today
         eq = "equals" — this is a filter

     .order('time', { ascending: true })
       → sort results by time, earliest first

     await → pause here until Supabase responds
     { data, error } → destructure the response into
       data (the rows returned) and error (any problem)
  ────────────────────────────────────────────────────────── */
  const { data, error } = await supabase
    .from('events')
    .select('title, time')
    .eq('date', today)
    .order('time', { ascending: true });

  /* ── HANDLE ERRORS ───────────────────────────────────────
     If something went wrong (no internet, wrong table name,
     credentials not filled in yet), log it to the console
     and show a friendly message instead of breaking the app.
  ────────────────────────────────────────────────────────── */
  if (error) {
    console.error('Calendar widget error:', error.message);
    container.innerHTML = '<p class="calendar-empty">Could not load events.</p>';
    return; /* stop this function here — don't run code below */
  }

  /* ── HANDLE EMPTY RESULTS ────────────────────────────────
     data will be an empty array [] if there are no events
     today. .length === 0 checks if the array has no items.
  ────────────────────────────────────────────────────────── */
  if (data.length === 0) {
    container.innerHTML = '<p class="calendar-empty">Nothing scheduled today ✿</p>';
    return;
  }

  /* ── BUILD THE EVENT LIST HTML ───────────────────────────
     data is an array of event objects like:
     [{ title: 'Dentist', time: '14:00' }, { title: 'Dinner', time: '18:30' }]

     .map() loops through each event and returns a string of
     HTML for that event. The result is an array of strings.

     .join('') stitches all those strings together into one
     big HTML string with no separator between them.

     The format function converts "14:00" to "2:00 PM"
  ────────────────────────────────────────────────────────── */
  const eventsHTML = data.map(event => `
    <div class="calendar-event fade-in">
      <div class="calendar-event-dot"></div>
      <span>${formatTime(event.time)} — ${event.title}</span>
    </div>
  `).join('');

  /* ── INJECT INTO THE WIDGET ──────────────────────────────
     innerHTML sets the HTML content inside the container.
     This replaces the "Loading events..." placeholder with
     our real event list.
  ────────────────────────────────────────────────────────── */
  container.innerHTML = eventsHTML;
}


/* ════════════════════════════════════════════════════════════
   SECTION 3 — SHOPPING WIDGET
   ════════════════════════════════════════════════════════════
   Fetches all items from the 'shopping' table and counts
   how many are checked vs total. Shows a summary like
   "3 of 7 items remaining" in the shopping widget card.
   ══════════════════════════════════════════════════════════ */

async function loadShoppingWidget() {
  const container = document.getElementById('widget-shopping-status');

  /* ── FETCH ALL SHOPPING ITEMS ────────────────────────────
     We select just two columns:
       id      → unique identifier for each item
       checked → boolean (true/false) — is it crossed off?

     No .eq() filter here — we want ALL items to count them.
  ────────────────────────────────────────────────────────── */
  const { data, error } = await supabase
    .from('shopping')
    .select('id, checked');

  if (error) {
    console.error('Shopping widget error:', error.message);
    container.innerHTML = '<p class="calendar-empty">Could not load list.</p>';
    return;
  }

  /* ── COUNT CHECKED VS TOTAL ──────────────────────────────
     data.length → total number of items on the list

     .filter() creates a new array containing only items
     where the condition is true. item.checked === false
     means "not yet crossed off" — these are the remaining items.

     .length on that filtered array gives us the count.
  ────────────────────────────────────────────────────────── */
  const total = data.length;
  const remaining = data.filter(item => item.checked === false).length;
  const done = total - remaining;

  /* ── HANDLE EMPTY LIST ───────────────────────────────────
     If there are no items at all, show a friendly message.
  ────────────────────────────────────────────────────────── */
  if (total === 0) {
    container.innerHTML = '<p class="calendar-empty">List is empty ✿</p>';
    return;
  }

  /* ── BUILD THE SUMMARY HTML ──────────────────────────────
     Template literals (backtick strings) let us embed
     variables directly inside a string using ${variable}.
     No string concatenation needed.
  ────────────────────────────────────────────────────────── */
  container.innerHTML = `
    <p class="shopping-summary fade-in">
      <span class="shopping-count">${remaining}</span> of ${total} items remaining
    </p>
    <p class="shopping-summary" style="font-size: 11px; color: var(--color-text-label); margin-top: 4px;">
      ${done} checked off ✿
    </p>
  `;
}


/* ════════════════════════════════════════════════════════════
   SECTION 4 — BUDGET WIDGET
   ════════════════════════════════════════════════════════════
   Fetches the current month's budget record from the 'budget'
   table. Shows a progress bar of spent vs total budget.
   ══════════════════════════════════════════════════════════ */

async function loadBudgetWidget() {
  const container = document.getElementById('widget-budget-progress');

  /* ── GET CURRENT MONTH AS YYYY-MM ────────────────────────
     We store one budget record per month, keyed by "YYYY-MM"
     e.g. "2025-06" for June 2025.

     toISOString() → "2025-06-06T12:00:00.000Z"
     .slice(0, 7)  → "2025-06" (first 7 characters)
  ────────────────────────────────────────────────────────── */
  const currentMonth = new Date().toISOString().slice(0, 7);

  /* ── FETCH THIS MONTH'S BUDGET ROW ──────────────────────
     .single() tells Supabase we expect exactly one row back
     instead of an array. If no row exists, data will be null.
  ────────────────────────────────────────────────────────── */
  const { data, error } = await supabase
    .from('budget')
    .select('total, spent')
    .eq('month', currentMonth)
    .single();

  if (error) {
    console.error('Budget widget error:', error.message);
    container.innerHTML = '<p class="calendar-empty">Could not load budget.</p>';
    return;
  }

  /* ── HANDLE NO BUDGET SET ────────────────────────────────
     If no budget row exists for this month yet, prompt
     the user to set one up.
  ────────────────────────────────────────────────────────── */
  if (!data) {
    container.innerHTML = '<p class="calendar-empty">No budget set for this month.</p>';
    return;
  }

  /* ── CALCULATE PERCENTAGE ────────────────────────────────
     Math.round() rounds to the nearest whole number.
     Math.min() caps the percentage at 100 so the bar never
     overflows past the end even if spending exceeds budget.

     Example: spent=850, total=1300
       (850 / 1300) * 100 = 65.38...
       Math.round(65.38) = 65
       Math.min(65, 100) = 65  → bar fills to 65%
  ────────────────────────────────────────────────────────── */
  const percentage = Math.min(Math.round((data.spent / data.total) * 100), 100);
  const isOverBudget = data.spent > data.total;

  /* ── FORMAT DOLLAR AMOUNTS ───────────────────────────────
     toLocaleString() formats a number with commas and the
     currency symbol based on the user's locale.
     'en-US' with style: 'currency', currency: 'USD' gives
     us "$1,300.00" formatting automatically.
  ────────────────────────────────────────────────────────── */
  const spentFormatted = data.spent.toLocaleString('en-US', {
    style: 'currency', currency: 'USD', minimumFractionDigits: 0
  });
  const totalFormatted = data.total.toLocaleString('en-US', {
    style: 'currency', currency: 'USD', minimumFractionDigits: 0
  });

  /* ── BUILD THE PROGRESS BAR HTML ─────────────────────────
     The bar fill width is set inline with style="width: X%"
     The over-budget class turns it red if spending exceeded
     the budget total.
  ────────────────────────────────────────────────────────── */
  container.innerHTML = `
    <div class="budget-bar-wrap fade-in">
      <div class="budget-bar-fill ${isOverBudget ? 'over-budget' : ''}"
           style="width: ${percentage}%">
      </div>
    </div>
    <div class="budget-labels">
      <span>${spentFormatted} spent</span>
      <span>${totalFormatted} total</span>
    </div>
  `;
}


/* ════════════════════════════════════════════════════════════
   SECTION 5 — HELPER FUNCTIONS
   ════════════════════════════════════════════════════════════
   Small reusable utility functions used by the sections above.
   ══════════════════════════════════════════════════════════ */

/* ── FORMAT TIME ─────────────────────────────────────────────
   Converts a 24-hour time string to 12-hour AM/PM format.
   Input:  "14:30"  (how Supabase stores it)
   Output: "2:30 PM" (how we display it)

   Split on ':' gives us ['14', '30']
   hours = 14, minutes = '30'
   14 >= 12 so period = 'PM', displayHour = 14 - 12 = 2
   Result: "2:30 PM"
────────────────────────────────────────────────────────────── */
function formatTime(timeString) {
  if (!timeString) return ''; /* if no time provided, return empty */

  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours, 10); /* convert string "14" to number 14 */
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12; /* 0 becomes 12 (midnight), 13 becomes 1 etc */

  return `${displayHour}:${minutes} ${period}`;
}


/* ════════════════════════════════════════════════════════════
   SECTION 6 — INITIALISE THE DASHBOARD
   ════════════════════════════════════════════════════════════
   This is the entry point — the first code that actually runs
   when the page loads. It calls all our functions above.

   We wrap everything in an async init() function so we can
   use await inside it, then call it immediately at the bottom.

   Promise.all() runs all three widget loaders AT THE SAME TIME
   instead of one after another. This means the page loads
   roughly 3x faster — all three requests go out simultaneously
   and we wait for all three to come back together.
   ══════════════════════════════════════════════════════════ */

async function init() {
  /* ── SET GREETING FIRST ──────────────────────────────────
     This is instant (no database needed) so it runs first.
     The user sees the greeting immediately while the widgets
     are still fetching their data in the background.
  ────────────────────────────────────────────────────────── */
  setGreeting();

  /* ── LOAD ALL THREE WIDGETS SIMULTANEOUSLY ───────────────
     Promise.all() takes an array of async operations and
     runs them all at the same time. It waits until ALL of
     them are complete before moving on.

     Without Promise.all() it would be:
       await loadCalendarWidget();  → wait ~300ms
       await loadShoppingWidget();  → wait another ~300ms
       await loadBudgetWidget();    → wait another ~300ms
       Total: ~900ms

     With Promise.all():
       All three fire at once → all finish in ~300ms
       Total: ~300ms  (3x faster!)
  ────────────────────────────────────────────────────────── */
  await Promise.all([
    loadCalendarWidget(),
    loadShoppingWidget(),
    loadBudgetWidget()
  ]);
}

/* ── RUN INIT ────────────────────────────────────────────────
   Call init() to start everything. The () at the end means
   "execute this function right now."
   This is the single line that kicks off the entire dashboard.
────────────────────────────────────────────────────────────── */
init();