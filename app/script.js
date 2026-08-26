const preload = document.querySelector(".preload");
const startBtn = document.querySelector("#btn_start");
const quizRulesCard = document.querySelector("#quiz_rules");
const continueBtn = document.querySelector("#continueBtn");
const countdownContainer = document.querySelector(".count-down-container ");
const exitBtn = document.querySelector("#exitBtn");
let quizCard = document.querySelector("#quiz_card");
let countdownText = document.getElementById("countdownText");
let countdownNum = document.getElementById("countdownNum");
let countdownTime = document.querySelector(".tym");
let questions = document.querySelector("#question");
let optionAnswerBtn = document.querySelector("#answer-option");
let complete = document.querySelector("#complete");
let correctScore = document.querySelector(".correct-score");
let totalQuestion = document.querySelector(".total-question");
let totalQuestion2 = document.querySelector(".total-question2");
let nextQuestion = document.querySelector(".next-question");
let replayBtn = document.querySelector(".replay-btn");
let quitBtn = document.querySelector(".quit-btn");
let questionNextNum = document.querySelector(".questionNextNum");
let percentageScore = document.querySelector(".percentage-score");
let percentageContainer = document.querySelector("#percentage");
const playerForm = document.getElementById("playerForm");
const playerNameInput = document.getElementById("playerName");
const nameContainer = document.querySelector("#nameContainer");
let playerName = "";

// form
let userForm = document.querySelector("#userForm");
let firstName = document.querySelector("#firstNameInput");
let lastName = document.querySelector("#lastNameInput");
let isEventDisabled;

// setting setTimeout for preloading
stopLoad();
function stopLoad() {
  window.addEventListener("load", () => {
    setTimeout(() => {
      preload.classList.add("hidden");
      nameContainer.classList.remove("hidden");
      // startBtn.classList.remove("hidden");
    }, 2000);
  });
}

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
  // document.querySelector(".btn-start").classList.remove("hidden");

  Swal.fire({
    icon: "success",
    title: `Welcome ${playerName}!`,
    text: "Click Start Quiz when you're ready to begin.",
    confirmButtonText: "OK",
  });
});

// Modify your existing window.addEventListener('load') function
// window.addEventListener("load", () => {
//   setTimeout(() => {
//     preload.classList.add("hidden");
//     nameContainer.classList.remove("hidden"); // Show name form instead of start button
//   }, 2000);
// });

function saveQuizResult(score) {
  // Get existing results or initialize empty array
  let results = JSON.parse(localStorage.getItem("quizResults")) || [];

  // Create new result object
  const newResult = {
    name: playerName, // You'll need to collect this from the user
    score: correctPicked,
    total: quizQuestions.length,
    percentage: ((correctPicked / quizQuestions.length) * 100).toFixed(1),
    date: new Date().toLocaleDateString(),
  };

  // Add new result to array
  results.push(newResult);

  // Sort by score (highest first)
  results.sort((a, b) => b.percentage - a.percentage);

  // Store in localStorage
  localStorage.setItem("quizResults", JSON.stringify(results));

  // Redirect to results page
  window.location.href = "results.html";
}

// adding Event Listener to start btn
startBtn.addEventListener("click", () => {
  startBtn.classList.add("hidden");
  preload.style.display = "flex";
  setTimeout(() => {
    preload.classList.add("hidden");
    quizRulesCard.classList.remove("hidden");
  }, 2000);
});

// Start Quiz

continueBtn.addEventListener("click", continueGo);

function continueGo() {
  countdownContainer.classList.remove("hidden");
  quizRulesCard.classList.add("hidden");

  let countdown = 3;
  countdownText.textContent = "Get ready... The game starts in ";
  countdownNum.textContent = "3";

  const interval = setInterval(() => {
    if (countdown > 1) {
      countdown--;
      countdownText.textContent = `Get ready... The game starts in `;
      countdownNum.textContent = countdown;
    } else {
      clearInterval(interval);
      countdownText.textContent = "Go!";
      countdownNum.classList.add("hidden");
      countdownContainer.classList.add("hidden");
      quizCard.classList.remove("hidden");
      startCountDown();
      //   const goInterval = setInterval(() => {

      //   }, 500);
    }
  }, 1000);
}

// Exit Button
exitBtn.addEventListener("click", function () {
  Swal.fire({
    title: "Are you sure you want to exit?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#0a69ed",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes",
  }).then((result) => {
    if (result.isConfirmed) {
      // window.close();
      preload.style.display = "flex";
      quizRulesCard.classList.add("hidden");
      window.setTimeout(() => {
        preload.style.display = "none";
        startBtn.classList.remove("hidden");
      }, 1000);
    }
  });
});

// Next question counting down
let isClicked = false;
function startCountDown() {
  countingDown = 30;

  countdownTime.innerHTML = countingDown;

  let countingDownInterval = setInterval(() => {
    countingDown--;
    // console.log(countingDown);

    countdownTime.innerHTML = countingDown;
    if (countingDown === 0) {
      // isClicked = false;
      clearInterval(countingDownInterval);
      load();
      // next();
      return;
    } else if (isClicked) {
      isClicked = false;
      clearInterval(countingDownInterval);
      next();
      return;
    }
  }, 1000);
}

// =============================
//Questions and Options array
// =============================

// const quizQuestions = [
//   {
//     id: 1,
//     question: "What is the result of the following expression: \n\n 5 + 3 * 2?",
//     options: ["16", "11", "10", "13"],
//     correct: "11",
//   },
//   {
//     id: 2,
//     question: "What is the result of: \n\n (6 + 2) * (4 / 2)?",
//     options: ["12", "16", "8", "20"],
//     correct: "16",
//   },
//   {
//     id: 3,
//     question: "Solve the expression: \n\n 10 - 4 + 3 * 5",
//     options: ["21", "16", "25", "31"],
//     correct: "21",
//   },
//   {
//     id: 4,
//     question: "Evaluate the expression: \n\n 2 ** 3 + 4 * 2",
//     options: ["16", "20", "18", "14"],
//     correct: "16",
//   },
// ];


const quizNodeExpressQuestions = [
  // ==============================
  // API FUNDAMENTALS
  // ==============================

  {
    id: 1,
    question: "What does API stand for?",
    options: [
      "Application Programming Interface",
      "Application Process Integration",
      "Advanced Programming Interface",
      "Application Program Internet",
    ],
    correct: "Application Programming Interface",
  },

  {
    id: 2,
    question: "What is the main purpose of an API?",
    options: [
      "To design a website",
      "To allow applications to communicate with each other",
      "To create CSS animations",
      "To store images",
    ],
    correct: "To allow applications to communicate with each other",
  },

  {
    id: 3,
    question: "What is an endpoint in an API?",
    options: [
      "A database table",
      "A specific location where an API can be accessed",
      "A JavaScript variable",
      "A CSS selector",
    ],
    correct: "A specific location where an API can be accessed",
  },

  {
    id: 4,
    question: "What is a path in an API?",
    options: [
      "The URL pattern used to identify a resource",
      "The database password",
      "The server's operating system",
      "The HTTP status code",
    ],
    correct: "The URL pattern used to identify a resource",
  },

  {
    id: 5,
    question: "What makes up a route in an Express application?",
    options: [
      "Only a URL",
      "Only an HTTP method",
      "HTTP method, path, and handler",
      "Only a controller",
    ],
    correct: "HTTP method, path, and handler",
  },

  // ==============================
  // HTTP METHODS AND CRUD
  // ==============================

  {
    id: 6,
    question: "Which HTTP method is normally used to retrieve data?",
    options: ["POST", "GET", "PUT", "DELETE"],
    correct: "GET",
  },

  {
    id: 7,
    question: "Which HTTP method is normally used to create a new resource?",
    options: ["GET", "POST", "PATCH", "DELETE"],
    correct: "POST",
  },

  {
    id: 8,
    question: "Which HTTP method is commonly used to replace an entire resource?",
    options: ["GET", "POST", "PUT", "PATCH"],
    correct: "PUT",
  },

  {
    id: 9,
    question: "Which HTTP method is commonly used to partially update a resource?",
    options: ["POST", "GET", "PATCH", "DELETE"],
    correct: "PATCH",
  },

  {
    id: 10,
    question: "Which HTTP method is used to delete a resource?",
    options: ["GET", "POST", "DELETE", "PUT"],
    correct: "DELETE",
  },

  {
    id: 11,
    question: "What does CRUD stand for?",
    options: [
      "Create, Read, Update, Delete",
      "Create, Run, Upload, Download",
      "Connect, Read, Update, Deploy",
      "Create, Request, Use, Delete",
    ],
    correct: "Create, Read, Update, Delete",
  },

  {
    id: 12,
    question: "Which HTTP method would you use for GET /api/students?",
    options: ["GET", "POST", "PUT", "DELETE"],
    correct: "GET",
  },

  {
    id: 13,
    question: "Which route would normally be used to retrieve student with ID 5?",
    options: [
      "/api/students",
      "/api/students/5",
      "/students?id=5",
      "/api/student?id",
    ],
    correct: "/api/students/5",
  },

  {
    id: 14,
    question: "What does :id represent in /api/students/:id?",
    options: [
      "A query string",
      "A route parameter",
      "A middleware",
      "A request body",
    ],
    correct: "A route parameter",
  },

  // ==============================
  // EXPRESS
  // ==============================

  {
    id: 15,
    question: "Which package is commonly used to create a server with Node.js?",
    options: ["Express", "Bootstrap", "Axios", "Sass"],
    correct: "Express",
  },

  {
    id: 16,
    question: "How do you create an Express application?",
    options: [
      "const app = express()",
      "const app = new ExpressServer()",
      "const app = createExpress()",
      "const app = Express.create()",
    ],
    correct: "const app = express()",
  },

  {
    id: 17,
    question: "Which method is used to define a GET route in Express?",
    options: ["app.fetch()", "app.get()", "app.request()", "app.read()"],
    correct: "app.get()",
  },

  {
    id: 18,
    question: "What does app.listen() do in an Express application?",
    options: [
      "Reads the database",
      "Starts the server and listens for requests",
      "Creates a route",
      "Deletes a resource",
    ],
    correct: "Starts the server and listens for requests",
  },

  {
    id: 19,
    question: "Which middleware allows Express to parse JSON request bodies?",
    options: [
      "express.json()",
      "express.body()",
      "express.parseJSON()",
      "express.requestJSON()",
    ],
    correct: "express.json()",
  },

  {
    id: 20,
    question: "If a client sends JSON data in a POST request, where can Express access the parsed data?",
    options: [
      "req.params",
      "req.body",
      "req.json",
      "req.data",
    ],
    correct: "req.body",
  },

  // ==============================
  // MIDDLEWARE AND CORS
  // ==============================

  {
    id: 21,
    question: "What is middleware in Express?",
    options: [
      "Code that can run during the request-response cycle",
      "A database",
      "A frontend framework",
      "A JSON file",
    ],
    correct: "Code that can run during the request-response cycle",
  },

  {
    id: 22,
    question: "Which package is commonly used to enable CORS in Express?",
    options: ["cors", "cross-origin", "express-cors-server", "origin"],
    correct: "cors",
  },

  {
    id: 23,
    question: "What is the main purpose of CORS?",
    options: [
      "To create database tables",
      "To allow controlled requests between different origins",
      "To encrypt passwords",
      "To parse JSON files",
    ],
    correct: "To allow controlled requests between different origins",
  },

  {
    id: 24,
    question: "Which code enables CORS in an Express application?",
    options: [
      "app.use(cors())",
      "app.cors(true)",
      "app.enable(cors)",
      "cors.enable(app)",
    ],
    correct: "app.use(cors())",
  },

  // ==============================
  // DOTENV AND FILE SYSTEM
  // ==============================

  {
    id: 25,
    question: "What is dotenv commonly used for?",
    options: [
      "Creating HTML pages",
      "Loading environment variables from a .env file",
      "Creating database tables",
      "Handling CSS",
    ],
    correct: "Loading environment variables from a .env file",
  },

  {
    id: 26,
    question: "How do you load variables from a .env file using dotenv?",
    options: [
      "dotenv.start()",
      "dotenv.load()",
      "dotenv.config()",
      "dotenv.env()",
    ],
    correct: "dotenv.config()",
  },

  {
    id: 27,
    question: "How can you access an environment variable called PORT?",
    options: [
      "env.PORT",
      "process.env.PORT",
      "dotenv.PORT",
      "process.PORT",
    ],
    correct: "process.env.PORT",
  },

  {
    id: 28,
    question: "Which Node.js module can be used to read and write files?",
    options: ["http", "fs", "url", "events"],
    correct: "fs",
  },

  // ==============================
  // PROFESSIONAL ARCHITECTURE
  // ==============================

  {
    id: 29,
    question: "What is the main responsibility of a controller?",
    options: [
      "Handle HTTP requests and responses",
      "Only store database files",
      "Only define URL paths",
      "Start the Node.js server",
    ],
    correct: "Handle HTTP requests and responses",
  },

  {
    id: 30,
    question: "What is the main responsibility of a service in a professional Express application?",
    options: [
      "Define CSS styles",
      "Handle business and data-related logic",
      "Define only HTTP methods",
      "Start the server",
    ],
    correct: "Handle business and data-related logic",
  },
];

let remainingQuestion = [...quizQuestions];
// console.log(remainingQuestion);

let wrongPicked = 0;
let correctPicked = 0;
let askedQuestionIndex = [];
totalQuestion2.textContent = quizQuestions.length;

function getRandomNumber() {
  let randomIndex;

  do {
    randomIndex = Math.floor(Math.random() * remainingQuestion.length);
  } while (askedQuestionIndex.includes(randomIndex));
  askedQuestionIndex.push(randomIndex);

  return randomIndex;
}

displayQuestion();
function displayQuestion() {
  if (askedQuestionIndex.length === remainingQuestion.length) {
    quizCard.classList.add("hidden");
    preload.style.display = "flex";
    setTimeout(() => {
      preload.classList.add("hidden");
      complete.classList.remove("hidden");
    }, 3000);

    // Calculate scores
    const correctPercentage = (
      (correctPicked / remainingQuestion.length) *
      100
    ).toFixed(1);
    correctScore.textContent = correctPicked;
    totalQuestion.textContent = quizQuestions.length;
    percentageScore.textContent = correctPercentage;

    if (correctPercentage >= 80) {
      percentageContainer.style.color = "green";
    } else if (correctPercentage >= 60) {
      percentageContainer.style.color = "#ffb200";
    } else {
      percentageContainer.style.color = "red";
    }

    console.log("Complete!" + correctPercentage);
    console.log("Wrong Answers: " + wrongPicked);
    console.log("Correct Answers: " + correctPicked);

    // Save results
    saveQuizResult();

    return;
  }

  let randomOptionIndex = [0, 1, 2, 3];
  randomOptionIndex.sort(() => Math.random() - 0.5);
  randomOptionIndex.forEach((num) => {
    num;
  });

  const currentQuestionIndex = getRandomNumber();
  const currentQuestion = remainingQuestion[currentQuestionIndex];
  questions.textContent = currentQuestion.question;
  optionAnswerBtn.innerHTML = "";

  currentQuestion.options.forEach((option, i) => {
    const button = document.createElement("p");
    button.textContent = option;
    button.classList.add("answer-option");
    optionAnswerBtn.appendChild(button);
    button.textContent = currentQuestion.options[randomOptionIndex[i]];

    isEventDisabled = true;

    button.addEventListener("click", () => {
      if (isEventDisabled) {
        if (button.textContent === currentQuestion.correct) {
          correctAns();
          correctPicked++;
        } else {
          correctAns();
          wrongPicked++;
          button.classList.add("wrong");
        }
        isEventDisabled = false;
      }
    });
  });

  let optionAnswerBtnNew = document.querySelectorAll(".answer-option");
  // ====================
  // Correct Function
  // ====================
  function correctAns() {
    optionAnswerBtnNew.forEach((btn) => {
      if (btn.textContent === currentQuestion.correct) {
        btn.classList.add("success");
      }
    });
    isClicked = true;
  }

  questionNextNum.textContent = `${askedQuestionIndex.length}. `;
  nextQuestion.textContent = askedQuestionIndex.length;
  console.log(askedQuestionIndex);
}

function next() {
  nextBtn.classList.remove("hidden");
}

nextBtn.addEventListener("click", () => {
  load();
});

function load() {
  displayQuestion();
  startCountDown();
  nextBtn.classList.add("hidden");
}

replayBtn.addEventListener("click", () => {
  // complete.classList.add("hidden");
  window.location.reload();
});

// Quit Button
quitBtn.addEventListener("click", function () {
  Swal.fire({
    title: "Are you sure you want to quit the game?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#0a69ed",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes",
  }).then((result) => {
    if (result.isConfirmed) {
      window.location.href = "../index.html";
    }
  });
});
