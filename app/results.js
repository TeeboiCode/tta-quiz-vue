// ============================================================
// results.js
// Reads the last quiz result from sessionStorage (set by
// script.js after a successful API save) and renders the
// result card with an animated score ring.
// ============================================================

window.addEventListener("load", () => {
  const loading   = document.getElementById("resultLoading");
  const empty     = document.getElementById("resultEmpty");
  const card      = document.getElementById("resultCard");

  // Small delay so the page doesn't flash
  setTimeout(() => {
    loading.classList.add("hidden");

    const raw = sessionStorage.getItem("lastResult");
    if (!raw) {
      empty.classList.remove("hidden");
      return;
    }

    let result;
    try {
      result = JSON.parse(raw);
    } catch {
      empty.classList.remove("hidden");
      return;
    }

    renderResult(result);
    card.classList.remove("hidden");

    // Clear so a page refresh doesn't re-show stale data
    sessionStorage.removeItem("lastResult");
  }, 600);
});

function renderResult(result) {
  const pct = parseFloat(result.percentage);
  const wrong = result.total - result.score;

  // Trophy / emoji based on score
  const trophy = document.getElementById("resultTrophy");
  if (pct >= 90)       trophy.textContent = "🏆";
  else if (pct >= 70)  trophy.textContent = "🌟";
  else if (pct >= 50)  trophy.textContent = "👍";
  else                 trophy.textContent = "💪";

  // Quiz name
  document.getElementById("resultQuizName").textContent =
    result.quizTitle || "Quiz";

  // Score ring animation
  const ringProgress = document.getElementById("ringProgress");
  const circumference = 2 * Math.PI * 50; // r = 50
  const offset = circumference - (pct / 100) * circumference;

  // Colour by performance
  let ringColour = "#ef4444"; // red < 50
  if (pct >= 80)      ringColour = "#22c55e"; // green
  else if (pct >= 60) ringColour = "#f59e0b"; // amber

  ringProgress.style.stroke = ringColour;

  // Animate the ring filling
  requestAnimationFrame(() => {
    ringProgress.style.transition = "stroke-dashoffset 1.2s ease";
    ringProgress.style.strokeDashoffset = offset;
  });

  document.getElementById("ringPct").textContent = `${pct}%`;
  document.getElementById("ringPct").style.color = ringColour;
  document.getElementById("ringSub").textContent =
    `${result.score} / ${result.total}`;

  // Stat cards
  document.getElementById("statCorrect").textContent = result.score;
  document.getElementById("statWrong").textContent   = wrong;
  document.getElementById("statTotal").textContent   = result.total;

  // Motivational message
  const msg = document.getElementById("resultMessage");
  if (pct >= 90)      msg.textContent = "Outstanding! You nailed it! 🎉";
  else if (pct >= 80) msg.textContent = "Great job! You're almost perfect! 💪";
  else if (pct >= 60) msg.textContent = "Good effort! Keep practising! 📚";
  else if (pct >= 40) msg.textContent = "Not bad — review the material and try again! 🔁";
  else                msg.textContent = "Keep going — every attempt makes you better! 🌱";

  // Meta
  document.getElementById("resultName").textContent = result.name;
  document.getElementById("resultDate").textContent = result.date;
}
