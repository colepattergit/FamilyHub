/* ============================================================
   config.js — Secret Configuration File
   ============================================================
   THIS FILE CONTAINS YOUR PRIVATE SUPABASE CREDENTIALS.

   ⚠️  IMPORTANT RULES FOR THIS FILE:
     1. NEVER paste this file into Claude or any AI chat
     2. NEVER share this file with anyone
     3. This file is listed in .gitignore so Git will NEVER
        upload it to GitHub — it stays on your computer only
     4. When your wife uses the app from her phone via the
        live GitHub Pages URL, she does not need this file —
        it only lives on the computer that is doing development

   HOW TO FILL THIS IN:
     1. Go to supabase.com and sign in
     2. Open your project
     3. Click Settings → API in the left sidebar
     4. Copy the Project URL and paste it below
     5. Copy the anon public key and paste it below
     Do this AFTER we set up Supabase in a future session.
   ============================================================ */

/* ── YOUR SUPABASE PROJECT URL ──────────────────────────────
   Found in: Supabase Dashboard → Settings → API → Project URL
   Looks like: https://abcdefghijklm.supabase.co
────────────────────────────────────────────────────────────── */
export const SUPABASE_URL = 'https://blbtxsurgtfrqmhgllrf.supabase.co';

/* ── YOUR SUPABASE ANON (PUBLIC) KEY ────────────────────────
   Found in: Supabase Dashboard → Settings → API → anon public
   This is the ANON key — safe for client use with RLS enabled.
   Never use the service_role key here — that one is dangerous.
   Looks like: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
────────────────────────────────────────────────────────────── */
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsYnR4c3VyZ3RmcnFtaGdsbHJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAyNjUzMzgsImV4cCI6MjA5NTg0MTMzOH0.DoVTNCAah2niP0gIdK_kJvNveFqhE5i8XG3dlBKxa4U';