// ============================================================
// admin/config.js
// Single source of truth for all admin API/auth configuration.
// Update API_BASE_URL and SUPABASE_* before deploying.
// ============================================================

const ADMIN_CONFIG = {
  // Backend API base URL
  API_BASE_URL: "http://localhost:5000",

  // Supabase project — used only for admin authentication (login/logout).
  // The ANON key is safe to use here: it has no elevated privileges.
  // All data operations go through the backend using the service role key.
  SUPABASE_URL: "https://feiphwbxsrekzcqcudth.supabase.co",
  SUPABASE_ANON_KEY:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlaXBod2J4c3Jla3pjcWN1ZHRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg5MTc4MDUsImV4cCI6MjEwNDQ5MzgwNX0.placeholder",
};
