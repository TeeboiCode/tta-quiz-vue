// ============================================================
// dashboard.js
// Loads stats and recent submissions for the admin dashboard.
// ============================================================

if (!requireAuth()) throw new Error("Redirecting to login.");

setActiveNav("dashboard");
renderUserBadge("#sidebarUser");
renderUserBadge("#headerUser");

// ── Load all data on page ready ───────────────────────────────
window.addEventListener("DOMContentLoaded", () => {
  loadStats();
  loadRecentSessions();
  loadQuizCount();
});

// ── Session stats ─────────────────────────────────────────────
async function loadStats() {
  const res = await apiFetch("/api/admin/sessions/stats");
  if (!res) return;

  const { data } = await res.json();

  document.getElementById("statTotal").textContent =
    data.total_attempts ?? 0;

  renderStatsTable(data.by_quiz || []);
}

function renderStatsTable(byQuiz) {
  const wrap = document.getElementById("statsTableWrap");

  if (!byQuiz.length) {
    wrap.innerHTML = emptyStateHTML("📭", "No data yet", "Results will appear here once students take a quiz.");
    return;
  }

  wrap.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Quiz</th>
          <th>Attempts</th>
          <th>Avg Score</th>
          <th>Highest</th>
          <th>Lowest</th>
        </tr>
      </thead>
      <tbody>
        ${byQuiz.map((q) => `
          <tr>
            <td><strong>${escHtml(q.quiz_title)}</strong></td>
            <td>${q.total_attempts}</td>
            <td><span class="${pctClass(q.average_percentage)}">${q.average_percentage}%</span></td>
            <td><span class="pct-high">${q.highest_percentage}%</span></td>
            <td><span class="${pctClass(q.lowest_percentage)}">${q.lowest_percentage}%</span></td>
          </tr>
        `).join("")}
      </tbody>
    </table>`;
}

// ── Recent sessions ───────────────────────────────────────────
async function loadRecentSessions() {
  const res = await apiFetch("/api/admin/sessions?limit=8&offset=0");
  if (!res) return;

  const { data } = await res.json();
  renderRecentTable(data || []);
}

function renderRecentTable(sessions) {
  const wrap = document.getElementById("recentTableWrap");

  if (!sessions.length) {
    wrap.innerHTML = emptyStateHTML("📭", "No submissions yet");
    return;
  }

  wrap.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Student</th>
          <th>Quiz</th>
          <th>Score</th>
          <th>%</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        ${sessions.map((s) => `
          <tr>
            <td>${escHtml(s.player_name)}</td>
            <td>${escHtml(s.quizzes?.title || "—")}</td>
            <td>${s.score} / ${s.total}</td>
            <td><span class="${pctClass(s.percentage)}">${s.percentage}%</span></td>
            <td>${formatDate(s.completed_at)}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>`;
}

// ── Quiz count + active quiz ──────────────────────────────────
async function loadQuizCount() {
  const res = await apiFetch("/api/admin/quizzes");
  if (!res) return;

  const { data } = await res.json();
  const quizzes = data || [];

  document.getElementById("statQuizCount").textContent = quizzes.length;

  const active = quizzes.find((q) => q.is_active);
  if (active) {
    document.getElementById("statActiveQuiz").textContent = active.title;
    document.getElementById("statActiveTime").textContent =
      `${active.time_per_question}s per question`;
  } else {
    document.getElementById("statActiveQuiz").textContent = "None";
    document.getElementById("statActiveTime").textContent = "No quiz is currently active";
  }
}
