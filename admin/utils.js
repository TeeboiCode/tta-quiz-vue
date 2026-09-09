// ============================================================
// utils.js
// Shared utilities for all admin dashboard pages.
// Must be loaded after auth.js.
// ============================================================

// ── Toast notifications ───────────────────────────────────────
(function initToasts() {
  const container = document.createElement("div");
  container.className = "toast-container";
  container.id = "toastContainer";
  document.body.appendChild(container);
})();

function showToast(message, type = "success", duration = 3500) {
  const container = document.getElementById("toastContainer");
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;

  const icon = type === "success" ? "✓" : type === "error" ? "✕" : "ℹ";
  toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transition = "opacity .3s";
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ── Percentage colour class ───────────────────────────────────
function pctClass(pct) {
  const n = parseFloat(pct);
  if (n >= 80) return "pct-high";
  if (n >= 60) return "pct-mid";
  return "pct-low";
}

// ── Format date ───────────────────────────────────────────────
function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  });
}

// ── Escape HTML to prevent XSS when injecting user content ───
function escHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ── Confirm dialog ────────────────────────────────────────────
function confirmAction(message) {
  return window.confirm(message);
}

// ── Spinner HTML helper ───────────────────────────────────────
function spinnerHTML() {
  return `<div class="spinner-wrap"><div class="spinner"></div></div>`;
}

// ── Empty state HTML helper ───────────────────────────────────
function emptyStateHTML(icon, title, subtitle = "") {
  return `
    <div class="empty-state">
      <span class="empty-state-icon">${icon}</span>
      <h3>${escHtml(title)}</h3>
      ${subtitle ? `<p>${escHtml(subtitle)}</p>` : ""}
    </div>`;
}

// ── Active nav item ───────────────────────────────────────────
function setActiveNav(id) {
  document.querySelectorAll(".nav-item").forEach((el) => {
    el.classList.toggle("active", el.dataset.nav === id);
  });
}

// ── Modal helpers ─────────────────────────────────────────────
function openModal(id) {
  document.getElementById(id)?.classList.remove("hidden");
}

function closeModal(id) {
  document.getElementById(id)?.classList.add("hidden");
}

// Close modal when clicking the backdrop
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal-backdrop")) {
    e.target.classList.add("hidden");
  }
});

// Close modal on Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    document.querySelectorAll(".modal-backdrop:not(.hidden)").forEach((m) => {
      m.classList.add("hidden");
    });
  }
});
