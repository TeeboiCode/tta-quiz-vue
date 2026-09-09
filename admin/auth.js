// ============================================================
// admin/auth.js
// Shared authentication utilities used by every admin page.
//
// Flow:
//   login.html  → calls signIn() → stores token in sessionStorage
//   all pages   → call requireAuth() on load → redirect to login if missing
//   all pages   → call apiHeaders() to get Bearer token header
//   logout      → calls signOut() → clears storage → redirects
// ============================================================

const AUTH_KEY    = "tta_admin_token";
const USER_KEY    = "tta_admin_user";
const LOGIN_PAGE  = "login.html";

// ── Token management ─────────────────────────────────────────

function getToken() {
  return sessionStorage.getItem(AUTH_KEY);
}

function setSession(token, user) {
  sessionStorage.setItem(AUTH_KEY, token);
  sessionStorage.setItem(USER_KEY, JSON.stringify(user));
}

function clearSession() {
  sessionStorage.removeItem(AUTH_KEY);
  sessionStorage.removeItem(USER_KEY);
}

function getUser() {
  try {
    return JSON.parse(sessionStorage.getItem(USER_KEY));
  } catch {
    return null;
  }
}

// ── Route guard ───────────────────────────────────────────────
// Call at the top of every protected page.
// Redirects to login.html if no token is present.

function requireAuth() {
  if (!getToken()) {
    window.location.href = LOGIN_PAGE;
    return false;
  }
  return true;
}

// ── API headers ───────────────────────────────────────────────
// Returns headers object with Authorization Bearer token.

function apiHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  };
}

// ── API fetch wrapper ─────────────────────────────────────────
// Wraps fetch() with auth headers. If the server returns 401,
// session is cleared and user is redirected to login.

async function apiFetch(path, options = {}) {
  const res = await fetch(`${ADMIN_CONFIG.API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...apiHeaders(),
      ...(options.headers || {}),
    },
  });

  if (res.status === 401) {
    clearSession();
    window.location.href = LOGIN_PAGE;
    return null;
  }

  return res;
}

// ── Login ─────────────────────────────────────────────────────
// Authenticates against Supabase Auth directly using
// email/password. Stores the access_token on success.

async function signIn(email, password) {
  const res = await fetch(
    `${ADMIN_CONFIG.SUPABASE_URL}/auth/v1/token?grant_type=password`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: ADMIN_CONFIG.SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({ email, password }),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    // Map common Supabase error messages to readable text
    const msg = data?.error_description || data?.msg || data?.message || "";
    if (msg.toLowerCase().includes("invalid login")) {
      throw new Error("Incorrect email or password. Please try again.");
    }
    if (msg.toLowerCase().includes("email not confirmed")) {
      throw new Error("Please confirm your email address before logging in.");
    }
    throw new Error("Login failed. Please try again.");
  }

  setSession(data.access_token, {
    email: data.user?.email,
    id: data.user?.id,
  });

  return data;
}

// ── Logout ────────────────────────────────────────────────────

function signOut() {
  clearSession();
  window.location.href = LOGIN_PAGE;
}

// ── Display logged-in email in the UI ─────────────────────────

function renderUserBadge(selector) {
  const el = document.querySelector(selector);
  if (!el) return;
  const user = getUser();
  if (user?.email) el.textContent = user.email;
}
