// ============================================================
// login.js
// Handles the admin login form submission.
// On success redirects to dashboard.html.
// ============================================================

// If already logged in, skip login page
if (sessionStorage.getItem("tta_admin_token")) {
  window.location.href = "dashboard.html";
}

const form      = document.getElementById("loginForm");
const emailEl   = document.getElementById("email");
const passwordEl= document.getElementById("password");
const errorEl   = document.getElementById("loginError");
const loginBtn  = document.getElementById("loginBtn");

function showError(msg) {
  errorEl.textContent = msg;
  errorEl.classList.remove("hidden");
}

function hideError() {
  errorEl.classList.add("hidden");
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  hideError();

  const email    = emailEl.value.trim();
  const password = passwordEl.value;

  // Basic client-side checks before hitting the network
  if (!email) { showError("Please enter your email address."); return; }
  if (!password) { showError("Please enter your password."); return; }

  loginBtn.disabled    = true;
  loginBtn.textContent = "Signing in…";

  try {
    await signIn(email, password);
    window.location.href = "dashboard.html";
  } catch (err) {
    showError(err.message);
  } finally {
    loginBtn.disabled    = false;
    loginBtn.textContent = "Sign In";
  }
});
