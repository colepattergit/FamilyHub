/* ============================================================
   auth.js — Session Guard
   ============================================================
   This file is imported by every page in the app (except
   login.html itself). It runs one check the moment any page
   loads:
 
     "Is there a saved session in localStorage?"
 
   If YES → the page loads normally, the logged-in user's
             data is available to that page's own scripts.
 
   If NO  → immediately redirect to login.html before
             anything else on the page can load or display.
 
   This is what protects your family data. Without this
   check, someone who knew your URL could open the app
   and see your dashboard without logging in.
 
   HOW SESSIONS WORK:
   When a user logs in successfully in login.html, we save
   a small JSON object to localStorage under the key 'fh_user'.
   localStorage persists across app restarts indefinitely
   until the user logs out (which clears it).
 
   JSON object looks like:
   {
     name:         "cole",      ← used for database queries
     display_name: "Cole",      ← used for UI greetings
     color:        "#7dd3fc"    ← used for accent color
   }
   ============================================================ */
 
/* ── READ THE SAVED SESSION ──────────────────────────────────
   localStorage.getItem() returns the stored string, or null
   if nothing has been saved under that key yet.
────────────────────────────────────────────────────────────── */
const stored = localStorage.getItem('fh_user');
 
/* ── CHECK AND REDIRECT ──────────────────────────────────────
   If nothing is stored, the user hasn't logged in (or has
   logged out). Send them to the login page immediately.
 
   We calculate the path to login.html dynamically based on
   where we are in the folder structure:
     - Pages inside pages/ folder need: pages/login.html
     - Root index.html needs: pages/login.html too
 
   We check the current path to determine which to use.
────────────────────────────────────────────────────────────── */
if (!stored) {
  /* Determine if we're in the pages/ subfolder or root */
  const inPagesFolder = window.location.pathname.includes('/pages/');
  const loginPath = inPagesFolder ? 'login.html' : 'pages/login.html';
 
  /* replace() sends to login and removes current page from
     browser history so back button can't return to dashboard */
  window.location.replace(loginPath);
}
 
/* ── EXPORT THE CURRENT USER ─────────────────────────────────
   If we reach this point, a session exists. Parse the JSON
   string back into a JavaScript object and export it so
   any page that imports auth.js can access the current user.
 
   JSON.parse() converts the stored string back to an object.
   Other files use it like:
     import { currentUser } from '../auth.js';
     console.log(currentUser.display_name); // "Cole"
────────────────────────────────────────────────────────────── */
export const currentUser = stored ? JSON.parse(stored) : null;
 
/* ── LOGOUT HELPER FUNCTION ──────────────────────────────────
   A reusable function any page can import and call to log
   the current user out. Clears the session and redirects
   to login. We'll wire this to a button in settings.html.
────────────────────────────────────────────────────────────── */
export function logout() {
  /* Remove the session from localStorage */
  localStorage.removeItem('fh_user');
 
  /* Redirect to login page */
  const inPagesFolder = window.location.pathname.includes('/pages/');
  const loginPath = inPagesFolder ? 'login.html' : 'pages/login.html';
  window.location.replace(loginPath);
}