/* ============================================================
   app.js — Home Dashboard Logic
   ============================================================
   WHAT CHANGED IN THIS VERSION:
     1. Calendar widget now shows weather + today's events.
        Tapping the widget opens calendar.html?day=TODAY.
        "What a relief, nothing happening!" when no events.
        Weather fetched from Open-Meteo (free, no API key).

     2. Everything else unchanged from previous version.
   ============================================================ */

import { supabase } from './supabase.js';
import { currentUser } from './auth.js';


/* ════════════════════════════════════════════════════════════
   SECTION 1 — GREETING & DATE
   ══════════════════════════════════════════════════════════ */

function setGreeting() {
  const now  = new Date();
  const hour = now.getHours();
  const name = currentUser?.display_name || '';

  let greeting;
  if (hour < 12) {
    greeting = `Good morning, ${name} ✿`;
  } else if (hour < 17) {
    greeting = `Good afternoon, ${name} ✿`;
  } else {
    greeting = `Good evening, ${name} ✿`;
  }

  const dateString = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year:    'numeric',
    month:   'long',
    day:     'numeric'
  });

  document.getElementById('greeting-text').textContent = greeting;
  document.getElementById('greeting-date').textContent = dateString;

  if (currentUser?.color) {
    document.documentElement.style.setProperty('--color-user-accent', currentUser.color);
    const greetingEl = document.getElementById('greeting-text');
    if (greetingEl) greetingEl.style.color = currentUser.color;
  }
}


/* ════════════════════════════════════════════════════════════
   SECTION 2 — CALENDAR WIDGET (UPDATED)
   ════════════════════════════════════════════════════════════
   Now shows:
     - Current weather for Fort Wayne, Indiana
     - Today's events with category color dots
     - "What a relief!" message when no events
     - Entire widget links to calendar?day=TODAY
   ══════════════════════════════════════════════════════════ */

async function loadCalendarWidget() {
  const today     = new Date().toISOString().split('T')[0];
  const container = document.getElementById('widget-calendar-events');
  const userName  = currentUser?.name;

  /* ── FETCH WEATHER AND EVENTS SIMULTANEOUSLY ─────────────
     Both requests fire at the same time using Promise.all.
     Open-Meteo is completely free and requires no API key.
     We use Fort Wayne coordinates:
       latitude:  41.0793
       longitude: -85.1394
  ────────────────────────────────────────────────────────── */
  const [weatherResult, eventsResult] = await Promise.allSettled([

    /* Weather fetch from Open-Meteo API
       current=temperature_2m → current temp in Fahrenheit
       current=weathercode    → WMO weather code for conditions
       temperature_unit=fahrenheit → US units */
    fetch('https://api.open-meteo.com/v1/forecast?latitude=41.0793&longitude=-85.1394&current=temperature_2m,weathercode&temperature_unit=fahrenheit&timezone=America%2FChicago'),

    /* Events fetch from Supabase */
    supabase
      .from('events')
      .select('title, time, all_day, category_id, categories(name, color)')
      .eq('date', today)
      .or(`visibility.eq.both,visibility.eq.${userName}`)
      .order('time', { ascending: true })
  ]);

  /* ── PARSE WEATHER ───────────────────────────────────────
     WMO weather codes map to human-readable descriptions.
     We use a simplified subset of the most common codes.
  ────────────────────────────────────────────────────────── */
  let weatherHTML = '';

  if (weatherResult.status === 'fulfilled') {
    try {
      const weatherData = await weatherResult.value.json();
      const temp        = Math.round(weatherData.current.temperature_2m);
      const code        = weatherData.current.weathercode;
      const condition   = getWeatherCondition(code);

      weatherHTML = `
        <div class="widget-weather">
          <span class="widget-weather-icon">${condition.icon}</span>
          <span class="widget-weather-temp">${temp}°F</span>
          <span class="widget-weather-desc">${condition.text}</span>
        </div>
      `;
    } catch (e) {
      /* Weather failed silently — not critical */
      console.warn('Weather parse error:', e);
    }
  }

  /* ── PARSE EVENTS ────────────────────────────────────────
     allSettled means we get results even if one failed.
     status === 'fulfilled' means it succeeded.
  ────────────────────────────────────────────────────────── */
  let eventsHTML = '';
  const todayStr = today; /* for the link */

  if (eventsResult.status === 'fulfilled') {
    const { data, error } = eventsResult.value;

    if (!error && data && data.length > 0) {
      /* Build event rows with colored dots */
      eventsHTML = data.map(event => {
        const color    = event.categories?.color || '#f9a8c9';
        const timeText = event.all_day ? 'All day' : formatTime(event.time);
        return `
          <div class="calendar-event fade-in">
            <div class="calendar-event-dot" style="background:${color}"></div>
            <span>${timeText} — ${event.title}</span>
          </div>
        `;
      }).join('');
    } else {
      /* No events today — show the fun message */
      eventsHTML = `
        <p class="widget-relief">
          What a relief, nothing happening! ✿
        </p>
      `;
    }
  } else {
    eventsHTML = '<p class="widget-empty">Could not load events.</p>';
  }

  /* ── BUILD FULL WIDGET HTML ──────────────────────────────
     The entire widget is wrapped in an <a> tag so tapping
     anywhere on it navigates to the calendar page with
     today's date pre-selected via the ?day= parameter.
  ────────────────────────────────────────────────────────── */
  container.innerHTML = `
    <a class="widget-calendar-link" href="pages/calendar.html?day=${todayStr}">
      ${weatherHTML}
      <div class="widget-calendar-events">
        ${eventsHTML}
      </div>
    </a>
  `;
}

/* ── GET WEATHER CONDITION ────────────────────────────────────
   Converts WMO weather code to an emoji icon and text.
   Full WMO code table: https://open-meteo.com/en/docs
   We cover the most common conditions.
────────────────────────────────────────────────────────────── */
function getWeatherCondition(code) {
  /* Clear */
  if (code === 0)                return { icon: '☀️',  text: 'Clear' };
  /* Mainly clear, partly cloudy */
  if (code <= 2)                 return { icon: '🌤️', text: 'Partly cloudy' };
  /* Overcast */
  if (code === 3)                return { icon: '☁️',  text: 'Overcast' };
  /* Fog */
  if (code <= 49)                return { icon: '🌫️', text: 'Foggy' };
  /* Drizzle */
  if (code <= 59)                return { icon: '🌦️', text: 'Drizzle' };
  /* Rain */
  if (code <= 69)                return { icon: '🌧️', text: 'Rainy' };
  /* Snow */
  if (code <= 79)                return { icon: '❄️',  text: 'Snowy' };
  /* Rain showers */
  if (code <= 84)                return { icon: '🌦️', text: 'Showers' };
  /* Snow showers */
  if (code <= 94)                return { icon: '🌨️', text: 'Snow showers' };
  /* Thunderstorm */
  return                                { icon: '⛈️',  text: 'Thunderstorm' };
}


/* ════════════════════════════════════════════════════════════
   SECTION 3 — SHOPPING WIDGET
   ══════════════════════════════════════════════════════════ */

async function loadShoppingWidget() {
  const container = document.getElementById('widget-shopping-status');
  const userName  = currentUser?.name;

  const { data: stores, error } = await supabase
    .from('shopping_stores')
    .select('id, name, secret, created_by')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Shopping widget error:', error.message);
    container.innerHTML = '<p class="widget-empty">Could not load lists.</p>';
    return;
  }

  const visibleStores = (stores || []).filter(store =>
    !store.secret || store.created_by === userName
  );

  if (visibleStores.length === 0) {
    container.innerHTML = '<p class="widget-empty">No shopping lists yet ✿</p>';
    return;
  }

  const storeIds = visibleStores.map(s => s.id);

  const { data: items } = await supabase
    .from('shopping_items')
    .select('store_id, checked_off')
    .in('store_id', storeIds);

  /* Build count map */
  const countMap = {};
  (items || []).forEach(item => {
    if (!countMap[item.store_id]) {
      countMap[item.store_id] = { total: 0, remaining: 0 };
    }
    countMap[item.store_id].total++;
    if (!item.checked_off) countMap[item.store_id].remaining++;
  });

  /* Build store cards */
  const cardsHTML = visibleStores.map(store => {
    const counts = countMap[store.id] || { total: 0, remaining: 0 };

    let countText;
    if (counts.total === 0) {
      countText = 'Empty — tap to add items';
    } else if (counts.remaining === 0) {
      countText = `All ${counts.total} items checked off ✓`;
    } else {
      countText = `${counts.remaining} of ${counts.total} remaining`;
    }

    return `
      <a class="widget-store-card" href="pages/shopping.html?store=${store.id}">
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
   ══════════════════════════════════════════════════════════ */

async function loadBudgetWidget() {
  const container    = document.getElementById('widget-budget-progress');
  const currentMonth = new Date().toISOString().slice(0, 7);
  const userName     = currentUser?.name;

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

  const percentage   = data.total_income > 0
    ? Math.min(Math.round((data.total_bills / data.total_income) * 100), 100)
    : 0;
  const isOverBudget = data.total_bills > data.total_income;

  const fmt = n => n.toLocaleString('en-US', {
    style: 'currency', currency: 'USD', minimumFractionDigits: 0
  });

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
   SECTION 5 — HELPERS
   ══════════════════════════════════════════════════════════ */

function formatTime(timeString) {
  if (!timeString) return '';
  const [hours, minutes] = timeString.split(':');
  const hour        = parseInt(hours, 10);
  const period      = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${period}`;
}


/* ════════════════════════════════════════════════════════════
   SECTION 6 — INIT
   ══════════════════════════════════════════════════════════ */

async function init() {
  setGreeting();
  await Promise.all([
    loadCalendarWidget(),
    loadShoppingWidget(),
    loadBudgetWidget()
  ]);
}

init();