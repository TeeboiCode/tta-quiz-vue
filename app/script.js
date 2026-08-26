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


// const quizQuestions = [
//   // ==============================
//   // API FUNDAMENTALS
//   // ==============================

//   {
//     id: 1,
//     question: "What does API stand for?",
//     options: [
//       "Application Programming Interface",
//       "Application Process Integration",
//       "Advanced Programming Interface",
//       "Application Program Internet",
//     ],
//     correct: "Application Programming Interface",
//   },

//   {
//     id: 2,
//     question: "What is the main purpose of an API?",
//     options: [
//       "To design a website",
//       "To allow applications to communicate with each other",
//       "To create CSS animations",
//       "To store images",
//     ],
//     correct: "To allow applications to communicate with each other",
//   },

//   {
//     id: 3,
//     question: "What is an endpoint in an API?",
//     options: [
//       "A database table",
//       "A specific location where an API can be accessed",
//       "A JavaScript variable",
//       "A CSS selector",
//     ],
//     correct: "A specific location where an API can be accessed",
//   },

//   {
//     id: 4,
//     question: "What is a path in an API?",
//     options: [
//       "The URL pattern used to identify a resource",
//       "The database password",
//       "The server's operating system",
//       "The HTTP status code",
//     ],
//     correct: "The URL pattern used to identify a resource",
//   },

//   {
//     id: 5,
//     question: "What makes up a route in an Express application?",
//     options: [
//       "Only a URL",
//       "Only an HTTP method",
//       "HTTP method, path, and handler",
//       "Only a controller",
//     ],
//     correct: "HTTP method, path, and handler",
//   },

//   // ==============================
//   // HTTP METHODS AND CRUD
//   // ==============================

//   {
//     id: 6,
//     question: "Which HTTP method is normally used to retrieve data?",
//     options: ["POST", "GET", "PUT", "DELETE"],
//     correct: "GET",
//   },

//   {
//     id: 7,
//     question: "Which HTTP method is normally used to create a new resource?",
//     options: ["GET", "POST", "PATCH", "DELETE"],
//     correct: "POST",
//   },

//   {
//     id: 8,
//     question: "Which HTTP method is commonly used to replace an entire resource?",
//     options: ["GET", "POST", "PUT", "PATCH"],
//     correct: "PUT",
//   },

//   {
//     id: 9,
//     question: "Which HTTP method is commonly used to partially update a resource?",
//     options: ["POST", "GET", "PATCH", "DELETE"],
//     correct: "PATCH",
//   },

//   {
//     id: 10,
//     question: "Which HTTP method is used to delete a resource?",
//     options: ["GET", "POST", "DELETE", "PUT"],
//     correct: "DELETE",
//   },

//   {
//     id: 11,
//     question: "What does CRUD stand for?",
//     options: [
//       "Create, Read, Update, Delete",
//       "Create, Run, Upload, Download",
//       "Connect, Read, Update, Deploy",
//       "Create, Request, Use, Delete",
//     ],
//     correct: "Create, Read, Update, Delete",
//   },

//   {
//     id: 12,
//     question: "Which HTTP method would you use for GET /api/students?",
//     options: ["GET", "POST", "PUT", "DELETE"],
//     correct: "GET",
//   },

//   {
//     id: 13,
//     question: "Which route would normally be used to retrieve student with ID 5?",
//     options: [
//       "/api/students",
//       "/api/students/5",
//       "/students?id=5",
//       "/api/student?id",
//     ],
//     correct: "/api/students/5",
//   },

//   {
//     id: 14,
//     question: "What does :id represent in /api/students/:id?",
//     options: [
//       "A query string",
//       "A route parameter",
//       "A middleware",
//       "A request body",
//     ],
//     correct: "A route parameter",
//   },

//   // ==============================
//   // EXPRESS
//   // ==============================

//   {
//     id: 15,
//     question: "Which package is commonly used to create a server with Node.js?",
//     options: ["Express", "Bootstrap", "Axios", "Sass"],
//     correct: "Express",
//   },

//   {
//     id: 16,
//     question: "How do you create an Express application?",
//     options: [
//       "const app = express()",
//       "const app = new ExpressServer()",
//       "const app = createExpress()",
//       "const app = Express.create()",
//     ],
//     correct: "const app = express()",
//   },

//   {
//     id: 17,
//     question: "Which method is used to define a GET route in Express?",
//     options: ["app.fetch()", "app.get()", "app.request()", "app.read()"],
//     correct: "app.get()",
//   },

//   {
//     id: 18,
//     question: "What does app.listen() do in an Express application?",
//     options: [
//       "Reads the database",
//       "Starts the server and listens for requests",
//       "Creates a route",
//       "Deletes a resource",
//     ],
//     correct: "Starts the server and listens for requests",
//   },

//   {
//     id: 19,
//     question: "Which middleware allows Express to parse JSON request bodies?",
//     options: [
//       "express.json()",
//       "express.body()",
//       "express.parseJSON()",
//       "express.requestJSON()",
//     ],
//     correct: "express.json()",
//   },

//   {
//     id: 20,
//     question: "If a client sends JSON data in a POST request, where can Express access the parsed data?",
//     options: [
//       "req.params",
//       "req.body",
//       "req.json",
//       "req.data",
//     ],
//     correct: "req.body",
//   },

//   // ==============================
//   // MIDDLEWARE AND CORS
//   // ==============================

//   {
//     id: 21,
//     question: "What is middleware in Express?",
//     options: [
//       "Code that can run during the request-response cycle",
//       "A database",
//       "A frontend framework",
//       "A JSON file",
//     ],
//     correct: "Code that can run during the request-response cycle",
//   },

//   {
//     id: 22,
//     question: "Which package is commonly used to enable CORS in Express?",
//     options: ["cors", "cross-origin", "express-cors-server", "origin"],
//     correct: "cors",
//   },

//   {
//     id: 23,
//     question: "What is the main purpose of CORS?",
//     options: [
//       "To create database tables",
//       "To allow controlled requests between different origins",
//       "To encrypt passwords",
//       "To parse JSON files",
//     ],
//     correct: "To allow controlled requests between different origins",
//   },

//   {
//     id: 24,
//     question: "Which code enables CORS in an Express application?",
//     options: [
//       "app.use(cors())",
//       "app.cors(true)",
//       "app.enable(cors)",
//       "cors.enable(app)",
//     ],
//     correct: "app.use(cors())",
//   },

//   // ==============================
//   // DOTENV AND FILE SYSTEM
//   // ==============================

//   {
//     id: 25,
//     question: "What is dotenv commonly used for?",
//     options: [
//       "Creating HTML pages",
//       "Loading environment variables from a .env file",
//       "Creating database tables",
//       "Handling CSS",
//     ],
//     correct: "Loading environment variables from a .env file",
//   },

//   {
//     id: 26,
//     question: "How do you load variables from a .env file using dotenv?",
//     options: [
//       "dotenv.start()",
//       "dotenv.load()",
//       "dotenv.config()",
//       "dotenv.env()",
//     ],
//     correct: "dotenv.config()",
//   },

//   {
//     id: 27,
//     question: "How can you access an environment variable called PORT?",
//     options: [
//       "env.PORT",
//       "process.env.PORT",
//       "dotenv.PORT",
//       "process.PORT",
//     ],
//     correct: "process.env.PORT",
//   },

//   {
//     id: 28,
//     question: "Which Node.js module can be used to read and write files?",
//     options: ["http", "fs", "url", "events"],
//     correct: "fs",
//   },

//   // ==============================
//   // PROFESSIONAL ARCHITECTURE
//   // ==============================

//   {
//     id: 29,
//     question: "What is the main responsibility of a controller?",
//     options: [
//       "Handle HTTP requests and responses",
//       "Only store database files",
//       "Only define URL paths",
//       "Start the Node.js server",
//     ],
//     correct: "Handle HTTP requests and responses",
//   },

//   {
//     id: 30,
//     question: "What is the main responsibility of a service in a professional Express application?",
//     options: [
//       "Define CSS styles",
//       "Handle business and data-related logic",
//       "Define only HTTP methods",
//       "Start the server",
//     ],
//     correct: "Handle business and data-related logic",
//   },
//   {
//     id: 31,
//     question:
//       "A frontend application needs to communicate with a backend server to retrieve student records. Which technology concept defines the interface through which this communication occurs?",
//     options: [
//       "API",
//       "IDE",
//       "GUI",
//       "CLI",
//     ],
//     correct: "API",
//   },

//   {
//     id: 32,
//     question:
//       "A developer wants to build a mobile application and needs libraries, tools, documentation, and debugging utilities provided for the platform. Which would be most appropriate?",
//     options: [
//       "SDK",
//       "URL",
//       "URI",
//       "CRUD",
//     ],
//     correct: "SDK",
//   },

//   {
//     id: 33,
//     question:
//       "Which statement best explains the difference between an IDE and a CLI?",
//     options: [
//       "An IDE is only used for databases, while a CLI is only used for websites",
//       "An IDE provides an integrated environment for developing software, while a CLI allows interaction through commands",
//       "An IDE is a programming language, while a CLI is a database",
//       "There is no difference between them",
//     ],
//     correct:
//       "An IDE provides an integrated environment for developing software, while a CLI allows interaction through commands",
//   },

//   {
//     id: 34,
//     question:
//       "Which of the following is an example of interacting with a computer through a CLI?",
//     options: [
//       "Clicking a folder in Windows Explorer",
//       "Typing npm install express in a terminal",
//       "Dragging an icon onto the desktop",
//       "Clicking a button in a web application",
//     ],
//     correct: "Typing npm install express in a terminal",
//   },

//   {
//     id: 35,
//     question:
//       "Which statement best describes a GUI?",
//     options: [
//       "A system that allows users to interact with software through visual elements",
//       "A protocol used to transfer web requests",
//       "A format used to store API data",
//       "A programming language",
//     ],
//     correct:
//       "A system that allows users to interact with software through visual elements",
//   },

//   {
//     id: 36,
//     question:
//       "In the URL https://example.com/products/15, which part identifies the protocol being used?",
//     options: [
//       "example.com",
//       "/products/15",
//       "https",
//       "15",
//     ],
//     correct: "https",
//   },

//   {
//     id: 37,
//     question:
//       "Which statement best describes the relationship between a URL and a URI?",
//     options: [
//       "A URL can be considered a type of URI that identifies a resource by describing where it can be located",
//       "A URI is always a database connection",
//       "A URL is only used for local files",
//       "They are completely unrelated concepts",
//     ],
//     correct:
//       "A URL can be considered a type of URI that identifies a resource by describing where it can be located",
//   },

//   {
//     id: 38,
//     question:
//       "A browser sends a request to a web server using a standard protocol for transferring web resources. Which protocol is being used?",
//     options: [
//       "HTTP",
//       "SQL",
//       "JSON",
//       "CRUD",
//     ],
//     correct: "HTTP",
//   },

//   {
//     id: 39,
//     question:
//       "What is the primary difference between HTTP and HTTPS?",
//     options: [
//       "HTTPS adds encryption and security to HTTP communication",
//       "HTTP is only for databases",
//       "HTTPS cannot be used with APIs",
//       "HTTP is faster because it stores data as JSON",
//     ],
//     correct:
//       "HTTPS adds encryption and security to HTTP communication",
//   },

//   {
//     id: 40,
//     question:
//       "An API returns the following response: { \"name\": \"John\", \"age\": 20 }. What data format is being used?",
//     options: [
//       "XML",
//       "JSON",
//       "SQL",
//       "HTML",
//     ],
//     correct: "JSON",
//   },

//   // ==========================================
//   // DATA AND DATABASE CONCEPTS
//   // ==========================================

//   {
//     id: 41,
//     question:
//       "Which situation is most appropriate for using XML instead of JSON?",
//     options: [
//       "A system specifically requires a structured XML-based format",
//       "You want to create a CSS stylesheet",
//       "You want to define a JavaScript function",
//       "You want to execute a SQL query",
//     ],
//     correct:
//       "A system specifically requires a structured XML-based format",
//   },

//   {
//     id: 42,
//     question:
//       "An application allows an administrator to add users, view users, modify users, and remove users. Which concept describes these four operations?",
//     options: [
//       "CRUD",
//       "GUI",
//       "SEO",
//       "DOM",
//     ],
//     correct: "CRUD",
//   },

//   {
//     id: 43,
//     question:
//       "Which of the following is an example of a relational database management system?",
//     options: [
//       "MySQL",
//       "MongoDB",
//       "Firebase",
//       "JSON",
//     ],
//     correct: "MySQL",
//   },

//   {
//     id: 44,
//     question:
//       "A developer needs to retrieve all students whose age is greater than 18 from a MySQL database. Which technology would normally be used to express this database query?",
//     options: [
//       "SQL",
//       "CSS",
//       "JSON",
//       "DOM",
//     ],
//     correct: "SQL",
//   },

//   {
//     id: 45,
//     question:
//       "Which statement best describes a NoSQL database?",
//     options: [
//       "It is a database approach that does not primarily rely on traditional relational tables",
//       "It can only store numbers",
//       "It is another name for HTML",
//       "It cannot store application data",
//     ],
//     correct:
//       "It is a database approach that does not primarily rely on traditional relational tables",
//   },

//   // ==========================================
//   // HTML AND DOM
//   // ==========================================

//   {
//     id: 46,
//     question:
//       "What is the primary responsibility of HTML in a web application?",
//     options: [
//       "Define the structure and content of the webpage",
//       "Handle database queries",
//       "Encrypt HTTP requests",
//       "Manage server processes",
//     ],
//     correct:
//       "Define the structure and content of the webpage",
//   },

//   {
//     id: 47,
//     question:
//       "When a browser converts HTML elements into a tree-like structure that JavaScript can access and modify, what is created?",
//     options: [
//       "BOM",
//       "DOM",
//       "API",
//       "SDK",
//     ],
//     correct: "DOM",
//   },

//   {
//     id: 48,
//     question:
//       "Consider the following HTML: <h1 id='title'>Hello</h1>. Which JavaScript expression correctly selects this element using its ID?",
//     options: [
//       "document.getElementById('title')",
//       "document.getElement('title')",
//       "document.selectId('title')",
//       "window.getElementById('title')",
//     ],
//     correct: "document.getElementById('title')",
//   },

//   {
//     id: 49,
//     question:
//       "A developer changes the text inside an HTML element using JavaScript while the page is already loaded. Which concept makes this possible?",
//     options: [
//       "DOM manipulation",
//       "SQL",
//       "SEO",
//       "SSR",
//     ],
//     correct: "DOM manipulation",
//   },

//   {
//     id: 50,
//     question:
//       "Which statement best describes SEO?",
//     options: [
//       "Techniques used to improve a website's visibility in search engine results",
//       "A protocol for communicating with databases",
//       "A JavaScript execution environment",
//       "A CSS measurement unit",
//     ],
//     correct:
//       "Techniques used to improve a website's visibility in search engine results",
//   },

//   // ==========================================
//   // CSS
//   // ==========================================

//   {
//     id: 51,
//     question:
//       "If an element has font-size: 16px on the root HTML element, approximately how many pixels is 2rem?",
//     options: [
//       "8px",
//       "16px",
//       "32px",
//       "64px",
//     ],
//     correct: "32px",
//   },

//   {
//     id: 52,
//     question:
//       "An element has a font-size of 20px and its child uses 1.5em. What does the em unit depend on?",
//     options: [
//       "The viewport width only",
//       "The relevant element's font size",
//       "The browser's screen resolution",
//       "The HTML document's URL",
//     ],
//     correct:
//       "The relevant element's font size",
//   },

//   {
//     id: 53,
//     question:
//       "Which CSS unit represents a percentage of the viewport's height?",
//     options: [
//       "vw",
//       "vh",
//       "rem",
//       "px",
//     ],
//     correct: "vh",
//   },

//   {
//     id: 54,
//     question:
//       "Which CSS unit represents a percentage of the viewport's width?",
//     options: [
//       "vh",
//       "em",
//       "vw",
//       "rem",
//     ],
//     correct: "vw",
//   },

//   {
//     id: 55,
//     question:
//       "Which of the following represents the color red using hexadecimal notation?",
//     options: [
//       "#00FF00",
//       "#0000FF",
//       "#FF0000",
//       "#FFFFFF",
//     ],
//     correct: "#FF0000",
//   },

//   // ==========================================
//   // JAVASCRIPT FUNDAMENTALS
//   // ==========================================

//   {
//     id: 56,
//     question:
//       "What does ECMAScript define in relation to JavaScript?",
//     options: [
//       "It defines the standard specification that JavaScript implementations follow",
//       "It is a CSS framework",
//       "It is a database engine",
//       "It is an HTML rendering engine",
//     ],
//     correct:
//       "It defines the standard specification that JavaScript implementations follow",
//   },

//   {
//     id: 57,
//     question:
//       "What was one of the major changes introduced with ES6?",
//     options: [
//       "let, const, arrow functions, classes, and other modern JavaScript features",
//       "HTML tables",
//       "CSS media queries",
//       "SQL databases",
//     ],
//     correct:
//       "let, const, arrow functions, classes, and other modern JavaScript features",
//   },

//   {
//     id: 58,
//     question:
//       "Which JavaScript construct is specifically designed to execute a function immediately after it is defined?",
//     options: [
//       "IIFE",
//       "DOM",
//       "BOM",
//       "SPA",
//     ],
//     correct: "IIFE",
//   },

//   {
//     id: 59,
//     question:
//       "A developer runs npm install express in the terminal. What is npm primarily responsible for in this situation?",
//     options: [
//       "Managing and installing JavaScript packages",
//       "Rendering HTML",
//       "Creating CSS animations",
//       "Managing browser cookies",
//     ],
//     correct:
//       "Managing and installing JavaScript packages",
//   },

//   {
//     id: 60,
//     question:
//       "A website loads one main HTML document and dynamically changes its content as users navigate without performing a full page reload for every view. What architecture does this describe?",
//     options: [
//       "SPA",
//       "SSR",
//       "SQL",
//       "XML",
//     ],
//     correct: "SPA",
//   },
// ];

const quizQuestions = [
  // ==========================================
  // API / SDK / IDE / CLI / GUI
  // ==========================================

  {
    id: 1,
    question:
      "A Vue frontend sends a POST request to a Node.js backend to create a student. The backend validates the request, stores the student, and returns JSON. Which component is acting as the API in this interaction?",
    options: [
      "The Vue component only",
      "The interface exposed by the backend for receiving and responding to requests",
      "The student's browser",
      "The JSON file alone",
    ],
    correct:
      "The interface exposed by the backend for receiving and responding to requests",
  },

  {
    id: 2,
    question:
      "A company provides authentication libraries, configuration tools, debugging utilities, and documentation specifically for developers building applications on its platform. What is this collection best described as?",
    options: [
      "API",
      "SDK",
      "CLI",
      "GUI",
    ],
    correct: "SDK",
  },

  {
    id: 3,
    question:
      "A developer runs `npm install express` from a terminal. Which statement correctly describes what is being used?",
    options: [
      "A GUI is being used to install an operating system",
      "A CLI is being used to interact with npm",
      "An API is being used to render a webpage",
      "An IDE is being used to compile CSS",
    ],
    correct: "A CLI is being used to interact with npm",
  },

  {
    id: 4,
    question:
      "Which situation is the clearest example of an IDE rather than simply a text editor?",
    options: [
      "Writing code in Notepad without additional tools",
      "Using VS Code with an integrated terminal, debugger, extensions, and source control tools",
      "Typing commands directly into CMD",
      "Opening a webpage in Chrome",
    ],
    correct:
      "Using VS Code with an integrated terminal, debugger, extensions, and source control tools",
  },

  {
    id: 5,
    question:
      "A user clicks buttons, opens menus, drags files, and interacts with visual windows instead of typing commands. Which interface is primarily being used?",
    options: [
      "CLI",
      "GUI",
      "API",
      "SDK",
    ],
    correct: "GUI",
  },

  // ==========================================
  // URL / URI / HTTP / HTTPS
  // ==========================================

  {
    id: 6,
    question:
      "Consider the URL: `https://example.com:5000/api/students/25?active=true`. Which part represents the query string?",
    options: [
      "https",
      "example.com:5000",
      "/api/students/25",
      "?active=true",
    ],
    correct: "?active=true",
  },

  {
    id: 7,
    question:
      "In `https://example.com:5000/api/students`, what does `5000` represent?",
    options: [
      "The protocol",
      "The port",
      "The resource ID",
      "The query parameter",
    ],
    correct: "The port",
  },

  {
    id: 8,
    question:
      "Which statement is the most technically accurate?",
    options: [
      "Every URI must contain a domain name",
      "Every URL is a URI, but a URI does not necessarily have to specify a network location",
      "Every URI is an HTTP request",
      "URL and URI can only be used with JSON APIs",
    ],
    correct:
      "Every URL is a URI, but a URI does not necessarily have to specify a network location",
  },

  {
    id: 9,
    question:
      "A browser successfully connects to an HTTPS API. Which security property is primarily provided by HTTPS through TLS?",
    options: [
      "It guarantees that the server's application code contains no bugs",
      "It encrypts data transmitted between the client and server",
      "It prevents all SQL injection attacks",
      "It automatically validates every API request",
    ],
    correct:
      "It encrypts data transmitted between the client and server",
  },

  {
    id: 10,
    question:
      "A developer says, 'Because my API uses HTTPS, I don't need authentication.' What is wrong with this statement?",
    options: [
      "HTTPS only works with frontend applications",
      "HTTPS protects communication in transit but does not determine whether a user is authorized",
      "HTTPS automatically creates passwords",
      "HTTPS only encrypts database records",
    ],
    correct:
      "HTTPS protects communication in transit but does not determine whether a user is authorized",
  },

  // ==========================================
  // JSON / XML
  // ==========================================

  {
    id: 11,
    question:
      "Which of the following is valid JSON?",
    options: [
      "{ name: 'John', age: 20 }",
      "{ \"name\": \"John\", \"age\": 20 }",
      "{ 'name': 'John', 'age': 20 }",
      "name = \"John\", age = 20",
    ],
    correct: "{ \"name\": \"John\", \"age\": 20 }",
  },

  {
    id: 12,
    question:
      "A Node.js application reads a JSON file using `fs.readFileSync()` and receives a string. Which operation is required before accessing `data.students`?",
    options: [
      "JSON.stringify(data)",
      "JSON.parse(data)",
      "data.toJSON()",
      "JSON.convert(data)",
    ],
    correct: "JSON.parse(data)",
  },

  {
    id: 13,
    question:
      "A JavaScript object needs to be written into a JSON file. Which sequence is correct?",
    options: [
      "JSON.parse() → fs.writeFileSync()",
      "JSON.stringify() → fs.writeFileSync()",
      "fs.readFileSync() → JSON.parse()",
      "JSON.parse() → JSON.stringify()",
    ],
    correct: "JSON.stringify() → fs.writeFileSync()",
  },

  {
    id: 14,
    question:
      "Which situation would most likely justify using XML instead of JSON in a modern application?",
    options: [
      "The system integrates with an existing XML-based enterprise service",
      "The developer wants to declare a JavaScript variable",
      "The browser needs to apply CSS",
      "The application needs a CSS animation",
    ],
    correct:
      "The system integrates with an existing XML-based enterprise service",
  },

  // ==========================================
  // CRUD / DATABASE / SQL / NOSQL
  // ==========================================

  {
    id: 15,
    question:
      "An administrator can add a student, retrieve student records, modify student information, and remove a student. Which set of operations describes this functionality?",
    options: [
      "HTTP",
      "CRUD",
      "DOM",
      "SEO",
    ],
    correct: "CRUD",
  },

  {
    id: 16,
    question:
      "Which operation is most closely associated with the 'Read' part of CRUD?",
    options: [
      "Retrieving an existing student",
      "Creating a new student",
      "Changing a student's email",
      "Deleting a student",
    ],
    correct: "Retrieving an existing student",
  },

  {
    id: 17,
    question:
      "A developer needs to find all students in a `students` table whose department is 'Computer Science'. Which technology is primarily responsible for expressing this query?",
    options: [
      "SQL",
      "CSS",
      "JSON",
      "DOM",
    ],
    correct: "SQL",
  },

  {
    id: 18,
    question:
      "Which query correctly retrieves students whose age is greater than 18 from a SQL table named `students`?",
    options: [
      "GET students WHERE age > 18",
      "SELECT * FROM students WHERE age > 18;",
      "FIND students IF age > 18;",
      "READ students WHERE age > 18;",
    ],
    correct: "SELECT * FROM students WHERE age > 18;",
  },

  {
    id: 19,
    question:
      "Which scenario is most characteristic of a relational SQL database?",
    options: [
      "Data is primarily organized into tables with relationships between records",
      "All data must be stored as HTML",
      "There are no defined relationships between data",
      "The database can only store JSON strings",
    ],
    correct:
      "Data is primarily organized into tables with relationships between records",
  },

  {
    id: 20,
    question:
      "A development team chooses MongoDB because student documents may have varying fields and the application benefits from a document-oriented data model. Which category does MongoDB belong to?",
    options: [
      "Relational SQL database",
      "NoSQL database",
      "CSS database",
      "XML database",
    ],
    correct: "NoSQL database",
  },

  // ==========================================
  // HTML / DOM / SEO
  // ==========================================

  {
    id: 21,
    question:
      "Consider the HTML: `<button id=\"saveBtn\">Save</button>`. Which JavaScript code correctly attaches a click event to the button?",
    options: [
      "document.getElementById('saveBtn').addEventListener('click', () => {})",
      "document.getElement('saveBtn').clickEvent(() => {})",
      "window.getElementById('saveBtn').event('click')",
      "document.select('saveBtn').onClick()",
    ],
    correct:
      "document.getElementById('saveBtn').addEventListener('click', () => {})",
  },

  {
    id: 22,
    question:
      "JavaScript executes `document.querySelector('.student').textContent = 'John';`. What is JavaScript modifying?",
    options: [
      "The database",
      "The DOM representation of the document",
      "The HTTP protocol",
      "The browser's operating system",
    ],
    correct:
      "The DOM representation of the document",
  },

  {
    id: 23,
    question:
      "Why is semantic HTML generally beneficial for SEO and accessibility?",
    options: [
      "Semantic elements provide meaningful structure that browsers, assistive technologies, and search engines can interpret",
      "Semantic HTML automatically encrypts the webpage",
      "Semantic HTML eliminates the need for CSS",
      "Semantic HTML makes JavaScript unnecessary",
    ],
    correct:
      "Semantic elements provide meaningful structure that browsers, assistive technologies, and search engines can interpret",
  },

  {
    id: 24,
    question:
      "Which change is most likely to improve the semantic structure of a webpage?",
    options: [
      "Replacing every element with `<div>`",
      "Using elements such as `<header>`, `<nav>`, `<main>`, `<section>`, and `<footer>` appropriately",
      "Removing headings from the document",
      "Using only inline styles",
    ],
    correct:
      "Using elements such as `<header>`, `<nav>`, `<main>`, `<section>`, and `<footer>` appropriately",
  },

  // ==========================================
  // CSS / UNITS / COLORS / UI / UX
  // ==========================================

  {
    id: 25,
    question:
      "The root element has `font-size: 16px`. A component uses `font-size: 1.5rem`. What is the resulting font size?",
    options: [
      "8px",
      "16px",
      "24px",
      "32px",
    ],
    correct: "24px",
  },

  {
    id: 26,
    question:
      "A parent element has `font-size: 20px`, and a child has `font-size: 1.5em`. Assuming no other rules affect the calculation, what is the child's font size?",
    options: [
      "15px",
      "20px",
      "30px",
      "40px",
    ],
    correct: "30px",
  },

  {
    id: 27,
    question:
      "A developer wants an element to always occupy approximately half of the browser viewport's width. Which unit is most directly appropriate?",
    options: [
      "50vh",
      "50vw",
      "50rem",
      "50px",
    ],
    correct: "50vw",
  },

  {
    id: 28,
    question:
      "Which hexadecimal color represents pure blue?",
    options: [
      "#FF0000",
      "#00FF00",
      "#0000FF",
      "#FFFFFF",
    ],
    correct: "#0000FF",
  },

  {
    id: 29,
    question:
      "A developer creates a dashboard where users repeatedly struggle to find the 'Submit' button even though the button is visually attractive. Which concept is primarily concerned with improving this interaction problem?",
    options: [
      "UX",
      "HEX",
      "RGB",
      "HTTP",
    ],
    correct: "UX",
  },

  {
    id: 30,
    question:
      "Which statement best distinguishes UI from UX?",
    options: [
      "UI focuses heavily on the interface's visual and interactive elements, while UX concerns the broader user experience",
      "UI is only for databases while UX is only for APIs",
      "UX defines CSS colors while UI defines SQL queries",
      "There is no meaningful distinction",
    ],
    correct:
      "UI focuses heavily on the interface's visual and interactive elements, while UX concerns the broader user experience",
  },

  // ==========================================
  // JAVASCRIPT / ECMASCRIPT / ES6
  // ==========================================

  {
    id: 31,
    question:
      "Which statement best describes ECMAScript?",
    options: [
      "It is the standardized specification on which JavaScript implementations are based",
      "It is another name for Node.js",
      "It is a browser used to execute JavaScript",
      "It is a JavaScript database",
    ],
    correct:
      "It is the standardized specification on which JavaScript implementations are based",
  },

  {
    id: 32,
    question:
      "Consider the code:\n\nconst user = { name: 'John' };\nuser.name = 'Peter';\n\nWhy is this allowed even though user was declared with const?",
    options: [
      "const makes every object property immutable",
      "const prevents reassignment of the variable binding but does not automatically freeze the object",
      "const only works with numbers",
      "JavaScript ignores const for objects",
    ],
    correct:
      "const prevents reassignment of the variable binding but does not automatically freeze the object",
  },

  {
    id: 33,
    question:
      "What is the output of the following code?\n\nlet x = 10;\n{\n  let x = 20;\n}\nconsole.log(x);",
    options: [
      "10",
      "20",
      "30",
      "undefined",
    ],
    correct: "10",
  },

  {
    id: 34,
    question:
      "Which ES6 feature allows a function to be written more concisely while also changing how `this` is handled?",
    options: [
      "Arrow functions",
      "Template literals",
      "Destructuring",
      "Spread syntax",
    ],
    correct: "Arrow functions",
  },

  // ==========================================
  // IIFE / NPM / NVM / AJAX
  // ==========================================

  {
    id: 35,
    question:
      "What is the primary reason an IIFE is useful in JavaScript?",
    options: [
      "It executes immediately and can create a private scope for variables",
      "It permanently stores data in a database",
      "It automatically creates an API",
      "It converts JavaScript into CSS",
    ],
    correct:
      "It executes immediately and can create a private scope for variables",
  },

  {
    id: 36,
    question:
      "Which of the following is a valid IIFE?",
    options: [
      "function test() {}",
      "(function test() { console.log('Hello'); })();",
      "function() test {}",
      "execute function test() {}",
    ],
    correct:
      "(function test() { console.log('Hello'); })();",
  },

  {
    id: 37,
    question:
      "A developer needs to switch between Node.js 18 and Node.js 22 on the same computer for different projects. Which tool is specifically designed for this purpose?",
    options: [
      "NPM",
      "NVM",
      "NPMX",
      "NodeCLI",
    ],
    correct: "NVM",
  },

  {
    id: 38,
    question:
      "What is the primary purpose of NPM in a Node.js project?",
    options: [
      "Managing packages, dependencies, scripts, and project metadata",
      "Managing different Node.js versions",
      "Rendering HTML in the browser",
      "Creating CSS variables",
    ],
    correct:
      "Managing packages, dependencies, scripts, and project metadata",
  },

  {
    id: 39,
    question:
      "A webpage sends an asynchronous HTTP request to a server, receives new data, and updates part of the page without performing a full page reload. Which historical web development concept describes this approach?",
    options: [
      "AJAX",
      "SEO",
      "OOP",
      "BOM",
    ],
    correct: "AJAX",
  },

  {
    id: 40,
    question:
      "A developer says, 'AJAX requires XML as the response format.' Why is this statement incorrect?",
    options: [
      "AJAX means Asynchronous JavaScript and XML historically, but it can exchange data formats such as JSON as well",
      "AJAX only works with CSS",
      "AJAX cannot communicate with servers",
      "AJAX is exclusively a database technology",
    ],
    correct:
      "AJAX means Asynchronous JavaScript and XML historically, but it can exchange data formats such as JSON as well",
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
