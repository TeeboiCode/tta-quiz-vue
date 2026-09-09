// ============================================================
// admin/results.js
// Paginated results table with filters:
//   - Filter by quiz
//   - Search by player name (partial match)
//   - Filter by date range
//   - Pagination (50 per page)
// ============================================================

if (!requireAuth()) throw new Error("Redirecting to login.");

setActiveNav("results");
renderUserBadge("#sidebarUser");

// ── Pagination state ─────────────────────────────────────────
const PAGE_SIZE = 50;
let currentOffset = 0;
let totalCount    = 0;

// ── Boot ─────────────────────────────────────────────────────
window.addEventListener("DOMContentLoaded", () => {
  loadQuizFilter();
  loadResults();

  document.getElementById("btnFilter").addEventListener("click", () => {
    currentOffset = 0;
    loadResults();
  });

  document.getElementById("btnClear").addEventListener("click", () => {
    document.getElementById("filterQuiz").value = "";
    document.getElementById("filterName").value = "";
    document.getElementById("filterFrom").value = "";
    document.getElementById("filterTo").value   = "";
    currentOffset = 0;
    loadResults();
  });

  document.getElementById("btnPrev").addEventListener("click", () => {
    if (currentOffset >= PAGE_SIZE) {
      currentOffset -= PAGE_SIZE;
      loadResults();
    }
  });

  document.getElementById("btnNext").addEventListener("click", () => {
    if (currentOffset + PAGE_SIZE < totalCount) {
      currentOffset += PAGE_SIZE;
      loadResults();
    }
  });

  // Also filter when pressing Enter in the name field
  document.getElementById("filterName").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      currentOffset = 0;
      loadResults();
    }
  });
});

// ── Populate quiz dropdown ────────────────────────────────────
async function loadQuizFilter() {
  const res = await apiFetch("/api/admin/quizzes");
  if (!res) return;

  const { data } = await res.json();
  const select = document.getElementById("filterQuiz");

  (data || []).forEach((quiz) => {
    const opt = document.createElement("option");
    opt.value = quiz.id;
    opt.textContent = quiz.title + (quiz.is_active ? " (Active)" : "");
    select.appendChild(opt);
  });
}

// ── Build query string from current filters ───────────────────
function buildQuery() {
  const params = new URLSearchParams();

  const quizId = document.getElementById("filterQuiz").value;
  const name   = document.getElementById("filterName").value.trim();
  const from   = document.getElementById("filterFrom").value;
  const to     = document.getElementById("filterTo").value;

  if (quizId) params.set("quiz_id", quizId);
  if (name)   params.set("player_name", name);
  if (from)   params.set("from_date", from);
  if (to)     params.set("to_date", to);

  params.set("limit",  PAGE_SIZE);
  params.set("offset", currentOffset);

  return params.toString();
}

// ── Load results ──────────────────────────────────────────────
async function loadResults() {
  const wrap = document.getElementById("resultsTableWrap");
  wrap.innerHTML = spinnerHTML();

  document.getElementById("pagination").classList.add("hidden");

  const res = await apiFetch(`/api/admin/sessions?${buildQuery()}`);
  if (!res) return;

  const json = await res.json();
  totalCount = json.pagination?.total ?? 0;

  renderResultsTable(json.data || []);
  renderPagination();

  document.getElementById("resultCount").textContent =
    `${totalCount} result${totalCount !== 1 ? "s" : ""}`;
}

// ── Render table ──────────────────────────────────────────────
function renderResultsTable(sessions) {
  const wrap = document.getElementById("resultsTableWrap");

  if (!sessions.length) {
    wrap.innerHTML = emptyStateHTML(
      "📭",
      "No results found",
      currentOffset > 0
        ? "No more results on this page."
        : "Try adjusting your filters or wait for students to complete the quiz."
    );
    return;
  }

  wrap.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Student Name</th>
          <th>Quiz</th>
          <th>Score</th>
          <th>Percentage</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        ${sessions.map((s, i) => `
          <tr>
            <td class="text-muted" style="font-size:.78rem;">${currentOffset + i + 1}</td>
            <td><strong>${escHtml(s.player_name)}</strong></td>
            <td>${escHtml(s.quizzes?.title || "—")}</td>
            <td>${s.score} / ${s.total}</td>
            <td>
              <span class="${pctClass(s.percentage)}">${s.percentage}%</span>
              ${pctBadge(parseFloat(s.percentage))}
            </td>
            <td class="text-muted" style="font-size:.82rem;">${formatDate(s.completed_at)}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>`;
}

function pctBadge(pct) {
  if (pct >= 80) return '<span class="badge badge-success" style="margin-left:.35rem;">Pass</span>';
  if (pct >= 60) return '<span class="badge badge-warn"    style="margin-left:.35rem;">Fair</span>';
  return             '<span class="badge badge-danger"  style="margin-left:.35rem;">Needs Work</span>';
}

// ── Pagination controls ───────────────────────────────────────
function renderPagination() {
  if (totalCount === 0) {
    document.getElementById("pagination").classList.add("hidden");
    return;
  }

  document.getElementById("pagination").classList.remove("hidden");

  const from = currentOffset + 1;
  const to   = Math.min(currentOffset + PAGE_SIZE, totalCount);

  document.getElementById("paginationInfo").textContent =
    `Showing ${from}–${to} of ${totalCount}`;

  document.getElementById("btnPrev").disabled = currentOffset === 0;
  document.getElementById("btnNext").disabled = currentOffset + PAGE_SIZE >= totalCount;
}
