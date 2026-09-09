// ============================================================
// script.js
// TTA Quiz — student-facing quiz logic
//
// Data flow:
//   1. On load  → fetch active quiz from API
//   2. On start → use quiz.questions (API data, not a local file)
//   3. On finish → POST result to API, pass to results page
//                  via sessionStorage
// ============================================================

// ============================================================
// DOM References
// ============================================================
const preload          = document.querySelector(".preload");
const startBtn         = document.querySelector("#btn_start");
const quizRulesCard    = document.querySelector("#quiz_rules");
const continueBtn      = document.querySelector("#continueBtn");
const countdownContainer = document.querySelector(".count-down-container");
const exitBtn          = document.querySelector("#exitBtn");
const quizCard         = document.querySelector("#quiz_card");
const countdownText    = document.getElementById("countdownText");
const countdownNum     = document.getElementById("countdownNum");
const countdownTime    = document.querySelector(".tym");
const questionEl       = document.querySelector("#question");
const optionAnswerBtn  = document.querySelector("#answer-option");
const complete         = document.querySelector("#complete");
const correctScore     = document.querySelector(".correct-score");
const totalQuestion    = document.querySelector(".total-question");
const totalQuestion2   = document.querySelector(".total-question2");
const nextQuestion     = document.querySelector(".next-question");
const replayBtn        = document.querySelector(".replay-btn");
const quitBtn          = document.querySelector(".quit-btn");
const questionNextNum  = document.querySelector(".questionNextNum");
const percentageScore  = document.querySelector(".percentage-score");
const percentageContainer = document.querySelector("#percentage");
const playerForm       = document.getElementById("playerForm");
const playerNameInput  = document.getElementById("playerName");
const nameContainer    = document.querySelector("#nameContainer");
const nextBtn          = document.querySelector("#nextBtn");
const progressBar      = document.querySelector(".progress-bar-fill");
const quizHeading      = document.querySelector(".quiz-card-top .heading");
const rulesTimeSpan    = document.querySelector(".sec");
const noQuizBanner     = document.querySelector("#noQuizBanner");

// ============================================================
// State
// ============================================================
let playerName         = "";
let correctPicked      = 0;
let wrongPicked        = 0;
let askedQuestionIndex = [];
let remainingQuestion  = [];
let isAnswered         = false;
let isClicked          = false;
let countingDownInterval = null;

// Quiz data loaded from the API
let quizData = null;   // { id, title, time_per_question, questions: [...] }

// ============================================================
// Step 1 — Fetch active quiz from API on page load
// ============================================================
window.addEventListener("load", async () => {
  try {
    const res = await fetch(`${CONFIG.API_BASE_URL}/api/quiz/active`);
    const json = await res.json();

    if (!res.ok || !json.data) {
      throw new Error(json.message || "No active quiz.");
    }

    quizData = json.data;

    // Normalise field names: API uses question_text / correct_answer
    // Map to the shape the rest of the code expects internally
    quizData.questions = quizData.questions.map((q) => ({
      ...q,
      question: q.question_text,
      correct:  q.correct_answer,
    }));

    // Patch the rules card timer text to match the actual quiz setting
    if (rulesTimeSpan) {
      rulesTimeSpan.textContent = `${quizData.time_per_question} seconds`;
    }

    // Show the name entry form
    setTimeout(() => {
      preload.classList.add("hidden");
      nameContainer.classList.remove("hidden");
    }, 1500);

  } catch (err) {
    // No active quiz — show friendly holding screen
    setTimeout(() => {
      preload.classList.add("hidden");
      if (noQuizBanner) {
        noQuizBanner.classList.remove("hidden");
      } else {
        // Fallback if the banner element doesn't exist in older HTML
        document.body.innerHTML = `
          <div style="
            display:flex;flex-direction:column;align-items:center;
            justify-content:center;height:100vh;background:#0a69ed;
            color:#fff;font-family:Poppins,sans-serif;text-align:center;
            padding:2rem;">
            <h2 style="font-size:2rem;margin-bottom:1rem;">No quiz right now 📋</h2>
            <p style="font-size:1.1rem;max-width:400px;opacity:0.9;">
              There's no active quiz at the moment.<br>
              Check back with your instructor for the next one.
            </p>
          </div>`;
      }
    }, 1500);
  }
});

// ============================================================
// Name Form Submit
// ============================================================
playerForm.addEventListener("submit", function (e) {
  e.preventDefault();

  playerName = playerNameInput.value.trim();

  if (playerName === "") {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Please enter your name!",
    });
    return;
  }

  nameContainer.classList.add("hidden");
  startBtn.classList.remove("hidden");

  Swal.fire({
    icon: "success",
    title: `Welcome, ${playerName}!`,
    text: "Click Start Quiz when you're ready to begin.",
    confirmButtonText: "Let's go!",
  });
});

// ============================================================
// Start Button → show rules
// ============================================================
startBtn.addEventListener("click", () => {
  startBtn.classList.add("hidden");
  preload.style.display = "flex";
  preload.classList.remove("hidden");
  setTimeout(() => {
    preload.classList.add("hidden");
    quizRulesCard.classList.remove("hidden");
  }, 1500);
});

// ============================================================
// Exit Button (from rules card)
// ============================================================
exitBtn.addEventListener("click", function () {
  Swal.fire({
    title: "Are you sure you want to exit?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#0a69ed",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, exit",
  }).then((result) => {
    if (result.isConfirmed) {
      quizRulesCard.classList.add("hidden");
      preload.style.display = "flex";
      preload.classList.remove("hidden");
      setTimeout(() => {
        preload.classList.add("hidden");
        startBtn.classList.remove("hidden");
      }, 1000);
    }
  });
});

// ============================================================
// Continue Button → 3-2-1 countdown then quiz
// ============================================================
continueBtn.addEventListener("click", continueGo);

function continueGo() {
  quizRulesCard.classList.add("hidden");
  countdownContainer.classList.remove("hidden");
  countdownNum.classList.remove("hidden");

  let countdown = 3;
  countdownText.textContent = "Get ready… The quiz starts in";
  countdownNum.textContent = countdown;

  const interval = setInterval(() => {
    countdown--;
    if (countdown > 0) {
      countdownNum.textContent = countdown;
    } else {
      clearInterval(interval);
      countdownText.textContent = "Go!";
      countdownNum.classList.add("hidden");

      setTimeout(() => {
        countdownContainer.classList.add("hidden");
        quizCard.classList.remove("hidden");

        // Initialise quiz state
        remainingQuestion  = [...quizData.questions];
        askedQuestionIndex = [];
        correctPicked      = 0;
        wrongPicked        = 0;
        isAnswered         = false;
        isClicked          = false;

        // Set total questions counter
        totalQuestion2.textContent = quizData.questions.length;

        // Set quiz title in the card header
        if (quizHeading) quizHeading.textContent = quizData.title;

        displayQuestion();
        startCountDown();
      }, 600);
    }
  }, 1000);
}

// ============================================================
// Timer — uses time_per_question from the API, not hardcoded 30
// ============================================================
function startCountDown() {
  if (countingDownInterval !== null) {
    clearInterval(countingDownInterval);
    countingDownInterval = null;
  }

  // Use quiz setting; fall back to 30 if somehow missing
  let countingDown = quizData?.time_per_question ?? 30;
  countdownTime.textContent = countingDown;

  countingDownInterval = setInterval(() => {
    countingDown--;
    countdownTime.textContent = countingDown;

    if (countingDown <= 0) {
      clearInterval(countingDownInterval);
      countingDownInterval = null;
      loadNextQuestion();
    } else if (isClicked) {
      clearInterval(countingDownInterval);
      countingDownInterval = null;
      isClicked = false;
      setTimeout(() => {
        showNextBtn();
      }, 400);
    }
  }, 1000);
}

// ============================================================
// Display a question
// ============================================================
function displayQuestion() {
  if (askedQuestionIndex.length === remainingQuestion.length) {
    finishQuiz();
    return;
  }

  isAnswered = false;

  // Pick a random unasked question
  let randomIndex;
  do {
    randomIndex = Math.floor(Math.random() * remainingQuestion.length);
  } while (askedQuestionIndex.includes(randomIndex));
  askedQuestionIndex.push(randomIndex);

  const currentQuestion = remainingQuestion[randomIndex];

  // API field: question_text (mapped to .question in normalisation above)
  questionEl.textContent = currentQuestion.question;
  questionNextNum.textContent = `${askedQuestionIndex.length}. `;
  nextQuestion.textContent = askedQuestionIndex.length;

  // Progress bar
  const pct = (askedQuestionIndex.length / remainingQuestion.length) * 100;
  if (progressBar) progressBar.style.width = `${pct}%`;

  // Shuffle options (API returns them as a JSON array)
  const shuffled = [...currentQuestion.options].sort(() => Math.random() - 0.5);

  optionAnswerBtn.innerHTML = "";
  shuffled.forEach((option) => {
    const btn = document.createElement("p");
    btn.textContent = option;
    btn.classList.add("answer-option");
    optionAnswerBtn.appendChild(btn);

    btn.addEventListener("click", () => {
      if (isAnswered) return;
      isAnswered = true;

      // API field: correct_answer (mapped to .correct above)
      document.querySelectorAll(".answer-option").forEach((b) => {
        if (b.textContent === currentQuestion.correct) {
          b.classList.add("success");
        }
      });

      if (btn.textContent === currentQuestion.correct) {
        correctPicked++;
      } else {
        btn.classList.add("wrong");
        wrongPicked++;
      }

      isClicked = true;
    });
  });

  nextBtn.classList.add("hidden");
}

// ============================================================
// Show Next button
// ============================================================
function showNextBtn() {
  nextBtn.classList.remove("hidden");
}

// ============================================================
// Load next question
// ============================================================
function loadNextQuestion() {
  displayQuestion();
  startCountDown();
  nextBtn.classList.add("hidden");
}

nextBtn.addEventListener("click", () => {
  loadNextQuestion();
});

// ============================================================
// Finish Quiz
// ============================================================
function finishQuiz() {
  if (countingDownInterval !== null) {
    clearInterval(countingDownInterval);
    countingDownInterval = null;
  }

  quizCard.classList.add("hidden");
  preload.style.display = "flex";
  preload.classList.remove("hidden");

  setTimeout(async () => {
    preload.classList.add("hidden");

    const total = quizData.questions.length;
    const correctPercentage = ((correctPicked / total) * 100).toFixed(1);

    correctScore.textContent = correctPicked;
    totalQuestion.textContent = total;
    percentageScore.textContent = correctPercentage;

    if (correctPercentage >= 80) {
      percentageContainer.style.color = "green";
    } else if (correctPercentage >= 60) {
      percentageContainer.style.color = "#ffb200";
    } else {
      percentageContainer.style.color = "red";
    }

    complete.classList.remove("hidden");

    // Save to API (non-blocking — quiz display shown regardless)
    await saveQuizResult(total);
  }, 2000);
}

// ============================================================
// Step 3 — Save result to API, pass to results page
// ============================================================
async function saveQuizResult(total) {
  try {
    const res = await fetch(`${CONFIG.API_BASE_URL}/api/sessions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        quiz_id:     quizData.id,
        player_name: playerName || "Anonymous",
        score:       correctPicked,
        total:       total,
      }),
    });

    const json = await res.json();

    if (!res.ok) {
      throw new Error(json.message || "Could not save result.");
    }

    // Store the saved session in sessionStorage so results.html can display it
    sessionStorage.setItem(
      "lastResult",
      JSON.stringify({
        name:       json.data.player_name,
        score:      json.data.score,
        total:      json.data.total,
        percentage: json.data.percentage,
        quizTitle:  quizData.title,
        date:       new Date().toLocaleDateString(),
      })
    );

  } catch (err) {
    // Result couldn't be saved — warn quietly without disrupting the UI
    console.warn("Result save failed:", err.message);
    Swal.fire({
      icon: "warning",
      title: "Heads up",
      text: "Your score was recorded locally but couldn't be saved to the server right now.",
      toast: true,
      position: "bottom-end",
      showConfirmButton: false,
      timer: 4000,
    });

    // Still give results page something to show
    sessionStorage.setItem(
      "lastResult",
      JSON.stringify({
        name:       playerName || "Anonymous",
        score:      correctPicked,
        total:      total,
        percentage: ((correctPicked / total) * 100).toFixed(2),
        quizTitle:  quizData?.title || "Quiz",
        date:       new Date().toLocaleDateString(),
      })
    );
  }
}

// ============================================================
// Replay Button
// ============================================================
replayBtn.addEventListener("click", () => {
  window.location.reload();
});

// ============================================================
// Quit Button
// ============================================================
quitBtn.addEventListener("click", function () {
  Swal.fire({
    title: "Are you sure you want to quit?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#0a69ed",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, quit",
  }).then((result) => {
    if (result.isConfirmed) {
      window.location.href = "../index.html";
    }
  });
});
