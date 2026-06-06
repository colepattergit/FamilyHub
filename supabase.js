/* ============================================================
   supabase.js — Database Connection
   ============================================================
   This file does ONE job: create and export a single Supabase
   client that every other file in the app can import and use
   to talk to the database.

   Think of it like this:
     - Supabase is your database living in the cloud
     - This file is the phone line connecting your app to it
     - Every other file (app.js, calendar.js, etc.) picks up
       that same phone line by importing { supabase } from here

   WHY ONE CENTRAL CONNECTION FILE?
   If we put the connection code in every file we would have
   to update credentials in 10 places instead of 1.
   Central = clean.

   HOW ES MODULE IMPORTS WORK:
     import → pulls code IN from another file
     export → makes code AVAILABLE to other files
   Files must use type="module" in HTML for this to work —
   which we already set up in index.html.
   ============================================================ */

/* ── IMPORT OUR SECRET CREDENTIALS ─────────────────────────
   We pull SUPABASE_URL and SUPABASE_ANON_KEY from config.js.
   That file lives on your computer but NOT on GitHub because
   it is listed in .gitignore.

   This file IS safe on GitHub because it never contains the
   actual secret values — it just references them by name.
────────────────────────────────────────────────────────────── */
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';

/* ── IMPORT THE SUPABASE LIBRARY ────────────────────────────
   We load Supabase directly from a CDN via a URL import.
   This means:
     - No npm install needed
     - No build tools needed
     - Works directly in the browser
     - Locked to version 2.39.3 so nothing breaks unexpectedly

   createClient is the one function we need. It takes our
   URL and key and returns a client object with methods like:
     .from()     → target a database table
     .select()   → read rows
     .insert()   → add a new row
     .update()   → change an existing row
     .delete()   → remove a row
────────────────────────────────────────────────────────────── */
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.3/+esm';

/* ── CREATE THE SUPABASE CLIENT ─────────────────────────────
   createClient(url, key) establishes the connection.

   SUPABASE_URL      → tells it WHERE your database lives
   SUPABASE_ANON_KEY → proves you are allowed to access it

   The result is exported as 'supabase' — a single shared
   object the rest of the app imports and uses like this:

     import { supabase } from './supabase.js';
     const { data } = await supabase.from('events').select('*');

   That one line fetches every row from your events table.
   We will write code like this in app.js and each page file.
────────────────────────────────────────────────────────────── */
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/* ── CONFIRM CONNECTION IN BROWSER CONSOLE ──────────────────
   Prints a confirmation message when the file loads.
   No secret info is shown — just a friendly status message.

   To see this message:
     On desktop → right-click page → Inspect → Console tab
     On iPhone  → Safari → Settings → Advanced → Web Inspector
                  then connect to Mac via cable
────────────────────────────────────────────────────────────── */
console.log('✿ Supabase connection ready — 家族ハブ');