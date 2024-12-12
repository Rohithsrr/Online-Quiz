const questions = [
    { question: "What is 2 + 2?", options: ["3", "4", "5", "6"], correct: 1 },
    { question: "What is the capital of France?", options: ["Berlin", "Madrid", "Paris", "Lisbon"], correct: 2 },
    { question: "Who is the CEO of Tesla?", options: ["Bill Gates", "Elon Musk", "Jeff Bezos", "Mark Zuckerberg"], correct: 1 },
    { question: "What is the square root of 16?", options: ["2", "3", "4", "5"], correct: 2 },
    { question: "What is the capital of Japan?", options: ["Beijing", "Seoul", "Tokyo", "Bangkok"], correct: 2 },
    { question: "What is the largest planet in our solar system?", options: ["Earth", "Jupiter", "Saturn", "Mars"], correct: 1 },
    { question: "Who developed the theory of relativity?", options: ["Isaac Newton", "Albert Einstein", "Galileo Galilei", "Niels Bohr"], correct: 1 },
    { question: "Which element has the chemical symbol 'O'?", options: ["Oxygen", "Osmium", "Ozone", "Oganesson"], correct: 0 },
    { question: "What is the boiling point of water?", options: ["90°C", "100°C", "110°C", "120°C"], correct: 1 },
    { question: "What is the speed of light?", options: ["3×10^8 m/s", "2×10^8 m/s", "1×10^8 m/s", "5×10^8 m/s"], correct: 0 }
];

let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 1800; // 30 minutes in seconds
let selectedAnswers = [];
let isReviewing = false;

const questionContainer = document.getElementById("question");
const optionsContainer = document.getElementById("options");
const nextBtn = document.getElementById("next-btn");
const prevBtn = document.getElementById("prev-btn");
const timerElement = document.getElementById("time-left");
const reviewBtn = document.getElementById("review-btn");
const navigationBar = document.getElementById("navigation-bar");
const finishBtn = document.createElement("button");
const scoreDisplay = document.createElement("div");
const reviewOption = document.createElement("button");

finishBtn.textContent = "Finish";
finishBtn.id = "finish-btn";
finishBtn.style.display = "none";
finishBtn.onclick = showScore;
nextBtn.parentNode.insertBefore(finishBtn, nextBtn.nextSibling);

scoreDisplay.id = "score-display";
scoreDisplay.style.display = "none";
document.body.appendChild(scoreDisplay);

reviewOption.textContent = "Review Answers";
reviewOption.id = "review-option";
reviewOption.style.display = "none";
reviewOption.onclick = startReview;
document.body.appendChild(reviewOption);

function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        timerElement.textContent = formatTime(timeLeft);
        if (timeLeft <= 0) {
            clearInterval(timer);
            showScore();
        }
    }, 1000);
}

function formatTime(seconds) {
    const hours = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${hours}:${minutes}:${secs}`;
}

function loadQuestion() {
    if (isReviewing) {
        loadReviewQuestion();
        return;
    }

    const currentQuestion = questions[currentQuestionIndex];
    questionContainer.textContent = currentQuestion.question;
    optionsContainer.innerHTML = "";
    currentQuestion.options.forEach((option, index) => {
        const optionBtn = document.createElement("button");
        optionBtn.textContent = option;
        optionBtn.onclick = () => selectAnswer(optionBtn, index);
        optionBtn.classList.add("option-btn");

        if (selectedAnswers[currentQuestionIndex] === index) {
            optionBtn.classList.add("selected-option");
        }

        optionsContainer.appendChild(optionBtn);
    });

    updateNavigationBar();
    updateButtonStates();
}

function selectAnswer(optionBtn, selectedIndex) {
    selectedAnswers[currentQuestionIndex] = selectedIndex;

    Array.from(optionsContainer.children).forEach(btn => {
        btn.classList.remove("selected-option");
    });
    optionBtn.classList.add("selected-option");

    nextBtn.disabled = false;
    finishBtn.style.display = currentQuestionIndex === questions.length - 1 ? "block" : "none";
}

function nextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        loadQuestion();
    } else if (isReviewing) {
        currentQuestionIndex++;
        loadReviewQuestion();
    }
}

function prevQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        loadQuestion();
    } else if (isReviewing) {
        currentQuestionIndex--;
        loadReviewQuestion();
    }
}

function showScore() {
    clearInterval(timer);
    score = calculateScore();
    scoreDisplay.style.display = "block";
    scoreDisplay.innerHTML = `<h2>Your Score: ${score}/${questions.length}</h2>`;
    reviewOption.style.display = "block";
    nextBtn.style.display = "none";
    prevBtn.style.display = "none";
    finishBtn.style.display = "none";
}

function startReview() {
    isReviewing = true;
    currentQuestionIndex = 0;
    scoreDisplay.style.display = "none";
    reviewOption.style.display = "none";
    nextBtn.style.display = "inline-block";
    prevBtn.style.display = "inline-block";
    loadReviewQuestion();
}

function loadReviewQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedAnswers[currentQuestionIndex] === currentQuestion.correct;

    questionContainer.textContent = `Q${currentQuestionIndex + 1}: ${currentQuestion.question}`;
    optionsContainer.innerHTML = "";
    currentQuestion.options.forEach((option, index) => {
        const optionBtn = document.createElement("button");
        optionBtn.textContent = option;
        optionBtn.classList.add("option-btn");

        if (index === currentQuestion.correct) {
            optionBtn.style.backgroundColor = "green"; // Correct answer in green
        }

        if (index === selectedAnswers[currentQuestionIndex]) {
            optionBtn.style.backgroundColor = "blue"; // Chosen answer in blue
            if (index !== currentQuestion.correct) {
                optionBtn.style.backgroundColor = "red"; // Incorrect answer in red
            }
        }

        optionsContainer.appendChild(optionBtn);
    });

    updateButtonStates();
}

function calculateScore() {
    return questions.reduce((score, question, index) => {
        return score + (selectedAnswers[index] === question.correct ? 1 : 0);
    }, 0);
}

function updateNavigationBar() {
    navigationBar.innerHTML = "";
    questions.forEach((_, index) => {
        const navBtn = document.createElement("button");
        navBtn.textContent = index + 1;
        navBtn.onclick = () => goToQuestion(index);
        navBtn.style.backgroundColor = selectedAnswers[index] !== undefined ? "#8BC34A" : "#FF9800";
        navigationBar.appendChild(navBtn);
    });
}

function goToQuestion(index) {
    currentQuestionIndex = index;
    loadQuestion();
}

function updateButtonStates() {
    prevBtn.disabled = currentQuestionIndex === 0;
    nextBtn.disabled = currentQuestionIndex === questions.length - 1 && !isReviewing;
    finishBtn.style.display = isReviewing || currentQuestionIndex === questions.length - 1 ? "block" : "none";
}

// Initialize the quiz
function initQuiz() {
    startTimer();
    loadQuestion();
    nextBtn.addEventListener("click", nextQuestion);
    prevBtn.addEventListener("click", prevQuestion);
    reviewBtn.addEventListener("click", startReview);
}

// Start the quiz
initQuiz();
