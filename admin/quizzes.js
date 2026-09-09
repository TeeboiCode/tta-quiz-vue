// ============================================================
// quizzes.js
// Full quiz and question management:
//   - List all quizzes
//   - Create / edit / delete quizzes
//   - Toggle active status (only one active at a time)
//   - Expand a quiz to see its questions
//   - Add / edit / delete questions
// ============================================================

if (!requireAuth()) throw new Error("Redirecting to login.");

setActiveNav("quizzes");
renderUserBadge("#sidebarUser");

// ── State ────────────────────────────────────────────────────
let allQuizzes   = [];
let editingQuizId = null;   // null = create mode, string = edit mode
let editingQuestionId = null;
let currentQuizIdForQuestion = null;
let expandedQuizId = null;

// ── Boot ─────────────────────────────────────────────────────
window.addEventListener("DOMContentLoaded", () => {
  loadQuizzes();
  document.getElementById("btnNewQuiz").addEventListener("click", openCreateQuiz);
  document.getElementById("quizModalSave").addEventListener("click", saveQuiz);
  document.getElementById("questionModalSave").addEventListener("click", saveQuestion);
  document.getElementById("btnAddOption").addEventListener("click", addOptionRow);
});

// ═══════════════════════════════════════════════════════════════
// QUIZ LIST
// ═══════════════════════════════════════════════════════════════

async function loadQuizzes() {
  const wrap = document.getElementById("quizListWrap");
  wrap.innerHTML = spinnerHTML();

  const res = await apiFetch("/api/admin/quizzes");
  if (!res) return;

  const { data } = await res.json();
  allQuizzes = data || [];
  renderQuizList();
}

function renderQuizList() {
  const wrap = document.getElementById("quizListWrap");

  if (!allQuizzes.length) {
    wrap.innerHTML = `
      <div class="section-header">
        <h2>All Quizzes</h2>
      </div>
      ${emptyStateHTML("📝", "No quizzes yet", "Click \"+ New Quiz\" to create your first one.")}`;
    return;
  }

  wrap.innerHTML = `
    <div class="section-header">
      <h2>All Quizzes <span class="text-muted" style="font-weight:400;font-size:.85rem;">(${allQuizzes.length})</span></h2>
    </div>
    <div id="quizCards">
      ${allQuizzes.map(renderQuizCard).join("")}
    </div>`;

  // Re-attach expand listeners
  allQuizzes.forEach((q) => {
    const header = document.getElementById(`quiz-header-${q.id}`);
    if (header) {
      header.addEventListener("click", (e) => {
        // Don't expand when clicking buttons
        if (e.target.closest("button")) return;
        toggleQuizExpand(q.id);
      });
    }
  });
}

function renderQuizCard(quiz) {
  const isExpanded = expandedQuizId === quiz.id;
  return `
    <div class="card" id="quiz-card-${quiz.id}">
      <div class="card-header" id="quiz-header-${quiz.id}" style="cursor:pointer;">
        <div style="display:flex;align-items:center;gap:.75rem;flex:1;min-width:0;">
          <span style="font-size:1.1rem">${isExpanded ? "▾" : "▸"}</span>
          <div style="min-width:0;">
            <div style="display:flex;align-items:center;gap:.5rem;flex-wrap:wrap;">
              <h3 style="font-size:.95rem;">${escHtml(quiz.title)}</h3>
              ${quiz.is_active
                ? '<span class="badge badge-success">Active</span>'
                : '<span class="badge badge-info">Inactive</span>'}
            </div>
            <p class="text-muted" style="font-size:.78rem;margin-top:.1rem;">
              ${escHtml(quiz.description || "No description")}
              &nbsp;·&nbsp; ${quiz.time_per_question}s / question
            </p>
          </div>
        </div>
        <div style="display:flex;gap:.4rem;flex-shrink:0;">
          <!-- Active toggle -->
          <label class="toggle-wrap" title="${quiz.is_active ? "Deactivate" : "Activate"}">
            <div class="toggle">
              <input type="checkbox" ${quiz.is_active ? "checked" : ""}
                onchange="toggleActive('${quiz.id}', this.checked)" />
              <span class="toggle-slider"></span>
            </div>
          </label>
          <button class="btn btn-ghost btn-sm btn-icon"
            title="Edit quiz"
            onclick="openEditQuiz('${quiz.id}')">✏️</button>
          <button class="btn btn-ghost btn-sm btn-icon"
            title="Delete quiz"
            onclick="deleteQuiz('${quiz.id}', '${escHtml(quiz.title).replace(/'/g, "\\'")}')">🗑️</button>
        </div>
      </div>

      <!-- Questions section (shown when expanded) -->
      <div id="quiz-questions-${quiz.id}" ${isExpanded ? "" : 'style="display:none"'}>
        <div style="padding:.75rem 1.25rem;border-top:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;">
          <span class="text-muted" style="font-size:.82rem;">Questions</span>
          <button class="btn btn-primary btn-sm"
            onclick="openAddQuestion('${quiz.id}')">+ Add Question</button>
        </div>
        <div id="questions-list-${quiz.id}" style="padding:0 1.25rem 1.25rem;">
          <div class="spinner-wrap" style="padding:1.5rem;"><div class="spinner"></div></div>
        </div>
      </div>
    </div>`;
}

// ── Expand/collapse a quiz to show questions ──────────────────
async function toggleQuizExpand(quizId) {
  const questionsDiv = document.getElementById(`quiz-questions-${quizId}`);
  const isOpen = questionsDiv.style.display !== "none";

  if (isOpen) {
    questionsDiv.style.display = "none";
    expandedQuizId = null;
  } else {
    questionsDiv.style.display = "block";
    expandedQuizId = quizId;
    await loadQuestions(quizId);
  }

  // Re-render the arrow indicator
  const header = document.getElementById(`quiz-header-${quizId}`);
  if (header) {
    const arrow = header.querySelector("span");
    if (arrow) arrow.textContent = isOpen ? "▸" : "▾";
  }
}

// ═══════════════════════════════════════════════════════════════
// QUIZ CRUD
// ═══════════════════════════════════════════════════════════════

function openCreateQuiz() {
  editingQuizId = null;
  document.getElementById("quizModalTitle").textContent = "New Quiz";
  document.getElementById("quizTitle").value = "";
  document.getElementById("quizDesc").value = "";
  document.getElementById("quizTime").value = "30";
  document.getElementById("quizModalError").classList.add("hidden");
  openModal("quizModal");
  document.getElementById("quizTitle").focus();
}

function openEditQuiz(quizId) {
  const quiz = allQuizzes.find((q) => q.id === quizId);
  if (!quiz) return;

  editingQuizId = quizId;
  document.getElementById("quizModalTitle").textContent = "Edit Quiz";
  document.getElementById("quizTitle").value = quiz.title;
  document.getElementById("quizDesc").value = quiz.description || "";
  document.getElementById("quizTime").value = quiz.time_per_question;
  document.getElementById("quizModalError").classList.add("hidden");
  openModal("quizModal");
  document.getElementById("quizTitle").focus();
}

async function saveQuiz() {
  const errorEl = document.getElementById("quizModalError");
  errorEl.classList.add("hidden");

  const title = document.getElementById("quizTitle").value.trim();
  const description = document.getElementById("quizDesc").value.trim();
  const time_per_question = parseInt(document.getElementById("quizTime").value, 10);

  if (!title) { showModalError(errorEl, "Quiz title is required."); return; }
  if (title.length < 3) { showModalError(errorEl, "Title must be at least 3 characters."); return; }
  if (isNaN(time_per_question) || time_per_question < 5 || time_per_question > 300) {
    showModalError(errorEl, "Time must be between 5 and 300 seconds.");
    return;
  }

  const saveBtn = document.getElementById("quizModalSave");
  saveBtn.disabled = true;
  saveBtn.textContent = "Saving…";

  const body = JSON.stringify({ title, description: description || null, time_per_question });
  const isEdit = editingQuizId !== null;

  const res = await apiFetch(
    isEdit ? `/api/admin/quizzes/${editingQuizId}` : "/api/admin/quizzes",
    { method: isEdit ? "PATCH" : "POST", body }
  );

  saveBtn.disabled = false;
  saveBtn.textContent = "Save Quiz";

  if (!res) return;
  const json = await res.json();

  if (!res.ok) {
    showModalError(errorEl, json.message || "Could not save quiz.");
    return;
  }

  closeModal("quizModal");
  showToast(isEdit ? "Quiz updated." : "Quiz created.", "success");
  await loadQuizzes();
}

async function toggleActive(quizId, activate) {
  const res = await apiFetch(`/api/admin/quizzes/${quizId}`, {
    method: "PATCH",
    body: JSON.stringify({ is_active: activate }),
  });

  if (!res) return;
  const json = await res.json();

  if (!res.ok) {
    showToast(json.message || "Could not update quiz.", "error");
    await loadQuizzes(); // re-render to restore checkbox state
    return;
  }

  showToast(
    activate ? "Quiz activated. All others deactivated." : "Quiz deactivated.",
    "success"
  );
  await loadQuizzes();
}

async function deleteQuiz(quizId, title) {
  if (!confirmAction(`Delete "${title}"?\n\nThis will also delete all its questions.\nThis cannot be undone.`)) return;

  const res = await apiFetch(`/api/admin/quizzes/${quizId}`, { method: "DELETE" });
  if (!res) return;

  const json = await res.json();
  if (!res.ok) {
    showToast(json.message || "Could not delete quiz.", "error");
    return;
  }

  showToast("Quiz deleted.", "success");
  await loadQuizzes();
}

// ═══════════════════════════════════════════════════════════════
// QUESTIONS
// ═══════════════════════════════════════════════════════════════

async function loadQuestions(quizId) {
  const listEl = document.getElementById(`questions-list-${quizId}`);
  listEl.innerHTML = spinnerHTML();

  const res = await apiFetch(`/api/admin/quizzes/${quizId}/questions`);
  if (!res) return;

  const { data } = await res.json();
  renderQuestions(quizId, data || []);
}

function renderQuestions(quizId, questions) {
  const listEl = document.getElementById(`questions-list-${quizId}`);

  if (!questions.length) {
    listEl.innerHTML = emptyStateHTML("❓", "No questions yet", "Click \"+ Add Question\" to add the first one.");
    return;
  }

  listEl.innerHTML = questions.map((q, i) => `
    <div class="question-item" id="qi-${q.id}">
      <div class="question-item-header">
        <span class="question-item-num">${i + 1}</span>
        <span class="question-item-text">${escHtml(q.question_text)}</span>
        <div class="question-item-actions">
          <button class="btn btn-ghost btn-sm btn-icon"
            title="Edit question"
            onclick="openEditQuestion('${quizId}','${q.id}')">✏️</button>
          <button class="btn btn-ghost btn-sm btn-icon"
            title="Delete question"
            onclick="deleteQuestion('${q.id}','${quizId}')">🗑️</button>
          <button class="btn btn-ghost btn-sm btn-icon"
            title="Toggle options"
            onclick="toggleQuestionBody('${q.id}')">▾</button>
        </div>
      </div>
      <div class="question-item-body" id="qbody-${q.id}">
        <ul class="option-list">
          ${q.options.map((opt) => `
            <li class="${opt === q.correct_answer ? "correct" : ""}">
              <span class="option-tick">${opt === q.correct_answer ? "✓" : "○"}</span>
              ${escHtml(opt)}
            </li>`).join("")}
        </ul>
      </div>
    </div>`).join("");
}

function toggleQuestionBody(questionId) {
  const body = document.getElementById(`qbody-${questionId}`);
  if (body) body.classList.toggle("open");
}

// ── Option rows in the question modal ────────────────────────
let optionRows = [];  // array of { text, isCorrect }

function renderOptionRows() {
  const list = document.getElementById("optionsList");
  list.innerHTML = optionRows.map((row, i) => `
    <div style="display:flex;gap:.4rem;align-items:center;margin-bottom:.4rem;" id="option-row-${i}">
      <input type="radio" name="correctOption" value="${i}"
        ${row.isCorrect ? "checked" : ""}
        title="Mark as correct answer"
        onchange="setCorrectOption(${i})"
        style="flex-shrink:0;cursor:pointer;accent-color:var(--brand);" />
      <input type="text" class="form-control"
        value="${escHtml(row.text)}"
        placeholder="Option ${i + 1}"
        oninput="updateOptionText(${i}, this.value)"
        style="flex:1;" />
      ${optionRows.length > 2
        ? `<button class="btn btn-ghost btn-sm btn-icon"
            onclick="removeOptionRow(${i})" title="Remove">✕</button>`
        : ""}
    </div>`).join("");
}

function addOptionRow() {
  if (optionRows.length >= 6) {
    showToast("Maximum 6 options allowed.", "error");
    return;
  }
  optionRows.push({ text: "", isCorrect: false });
  renderOptionRows();
}

function removeOptionRow(index) {
  const wasCorrect = optionRows[index].isCorrect;
  optionRows.splice(index, 1);
  if (wasCorrect && optionRows.length > 0) optionRows[0].isCorrect = true;
  renderOptionRows();
}

function updateOptionText(index, value) {
  optionRows[index].text = value;
}

function setCorrectOption(index) {
  optionRows.forEach((r, i) => (r.isCorrect = i === index));
}

// ── Open add question modal ───────────────────────────────────
function openAddQuestion(quizId) {
  editingQuestionId = null;
  currentQuizIdForQuestion = quizId;

  document.getElementById("questionModalTitle").textContent = "Add Question";
  document.getElementById("qText").value = "";
  document.getElementById("qOrder").value = "";
  document.getElementById("questionModalError").classList.add("hidden");

  // Start with 4 blank options, first one marked correct
  optionRows = [
    { text: "", isCorrect: true },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
  ];
  renderOptionRows();
  openModal("questionModal");
  document.getElementById("qText").focus();
}

// ── Open edit question modal ──────────────────────────────────
async function openEditQuestion(quizId, questionId) {
  editingQuestionId = questionId;
  currentQuizIdForQuestion = quizId;

  document.getElementById("questionModalTitle").textContent = "Edit Question";
  document.getElementById("questionModalError").classList.add("hidden");
  openModal("questionModal");

  // Fetch the question's current data
  const res = await apiFetch(`/api/admin/quizzes/${quizId}/questions`);
  if (!res) return;
  const { data } = await res.json();
  const q = data.find((x) => x.id === questionId);
  if (!q) { closeModal("questionModal"); return; }

  document.getElementById("qText").value = q.question_text;
  document.getElementById("qOrder").value = q.display_order ?? "";

  optionRows = q.options.map((opt) => ({
    text: opt,
    isCorrect: opt === q.correct_answer,
  }));
  renderOptionRows();
}

// ── Save question (create or update) ─────────────────────────
async function saveQuestion() {
  const errorEl = document.getElementById("questionModalError");
  errorEl.classList.add("hidden");

  const question_text = document.getElementById("qText").value.trim();
  const orderVal = document.getElementById("qOrder").value.trim();
  const display_order = orderVal !== "" ? parseInt(orderVal, 10) : undefined;

  // Validate
  if (question_text.length < 10) {
    showModalError(errorEl, "Question text must be at least 10 characters.");
    return;
  }

  const validOptions = optionRows.filter((r) => r.text.trim() !== "");
  if (validOptions.length < 2) {
    showModalError(errorEl, "Please provide at least 2 non-empty options.");
    return;
  }

  const correctRow = optionRows.find((r) => r.isCorrect);
  if (!correctRow || !correctRow.text.trim()) {
    showModalError(errorEl, "Please mark one option as the correct answer.");
    return;
  }

  const options = validOptions.map((r) => r.text.trim());
  const correct_answer = correctRow.text.trim();

  if (!options.includes(correct_answer)) {
    showModalError(errorEl, "The correct answer must be one of the options.");
    return;
  }

  const saveBtn = document.getElementById("questionModalSave");
  saveBtn.disabled = true;
  saveBtn.textContent = "Saving…";

  const body = JSON.stringify({
    question_text,
    options,
    correct_answer,
    ...(display_order !== undefined && { display_order }),
  });

  const isEdit = editingQuestionId !== null;
  const res = await apiFetch(
    isEdit
      ? `/api/admin/questions/${editingQuestionId}`
      : `/api/admin/quizzes/${currentQuizIdForQuestion}/questions`,
    { method: isEdit ? "PATCH" : "POST", body }
  );

  saveBtn.disabled = false;
  saveBtn.textContent = "Save Question";

  if (!res) return;
  const json = await res.json();

  if (!res.ok) {
    showModalError(errorEl, json.message || (json.errors && json.errors[0]) || "Could not save question.");
    return;
  }

  closeModal("questionModal");
  showToast(isEdit ? "Question updated." : "Question added.", "success");
  await loadQuestions(currentQuizIdForQuestion);
}

// ── Delete question ───────────────────────────────────────────
async function deleteQuestion(questionId, quizId) {
  if (!confirmAction("Delete this question? This cannot be undone.")) return;

  const res = await apiFetch(`/api/admin/questions/${questionId}`, {
    method: "DELETE",
  });
  if (!res) return;

  const json = await res.json();
  if (!res.ok) {
    showToast(json.message || "Could not delete question.", "error");
    return;
  }

  showToast("Question deleted.", "success");
  await loadQuestions(quizId);
}

// ── Utility: show error inside a modal ───────────────────────
function showModalError(el, msg) {
  el.textContent = msg;
  el.classList.remove("hidden");
}
