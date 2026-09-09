# TTA Quiz Application (`tta-quiz-vue`)

A modern, responsive web application for taking interactive quizzes, tracking user performance, and managing quiz content via a dedicated administrator dashboard.

---

## 🌟 Key Features

### Candidate Portal (`/app`)
- **User Registration & Login**: Simple onboard flow for quiz candidates.
- **Interactive Quiz Interface**: Timed multiple-choice quizzes with dynamic navigation, timer warning alerts, and real-time question progress.
- **Detailed Results Dashboard**: Comprehensive post-quiz feedback showing score summary, performance breakdown, and correct answers.
- **Configurable Backend Integration**: Connects dynamically to the `tta-quiz-be` Express API.

### Admin Dashboard (`/admin`)
- **Secure Authentication**: Protected admin login.
- **Quiz Management**: Create, view, update, and organize quiz categories.
- **Question Editor**: Easily add and configure multiple-choice questions.
- **Candidate Analytics**: Inspect candidate submissions, scores, and completion metrics.

---

## 💻 Tech Stack

- **Frontend**: HTML5, CSS3 (Modern Flexbox/Grid), Vanilla JavaScript (ES6+)
- **Icons & Fonts**: Font Awesome 6, Inter Font family
- **API Communication**: Fetch API connecting to `tta-quiz-be`

---

## 📂 Project Structure

```text
tta-quiz-vue/
├── app/                  # Candidate Web Application
│   ├── index.html        # Landing & Quiz selection
│   ├── register.html     # User registration page
│   ├── results.html      # Post-quiz score summary page
│   ├── config.js         # API BASE URL configuration
│   ├── script.js         # Core candidate quiz logic
│   └── style.css         # Styling system
├── admin/                # Administrator Dashboard
│   ├── login.html        # Admin login page
│   ├── dashboard.html    # Analytics & overview
│   ├── quizzes.html      # Quiz management dashboard
│   ├── results.html      # Submission review dashboard
│   └── style.css         # Admin custom theme
├── question.js           # Question data module
└── README.md
```

---

## 🚦 Getting Started

### 1. Configuration

Update `app/config.js` with your backend server URL (defaults to local development backend):

```javascript
const CONFIG = {
  API_BASE_URL: "http://localhost:5000",
};
```

### 2. Launching the App

You can serve the static files using any local web server, such as Live Server in VS Code, Python's `http.server`, or Vite/Http-server:

```bash
# Example using npx http-server
npx http-server . -p 3000
```

Open your browser to `http://localhost:3000/app/index.html` for candidates or `http://localhost:3000/admin/login.html` for administrators.

---

## 📄 License

[MIT](LICENSE)
