let currentIndex = 0;
let quizData = [];
let rightScore = 0;
let wrongScore = 0;
let attemptedAnswers = {}; // Track attempted question indices

const questionElem = document.getElementById("question");
const formElem = document.getElementById("options-form");
const feedbackElem = document.getElementById("feedback");
const nextBtn = document.getElementById("next-btn");
const backBtn = document.getElementById("back-btn");

const rightScoreElem = document.getElementById("right-score");
const wrongScoreElem = document.getElementById("wrong-score");
const totalScoreElem = document.getElementById("total-score");

const currentQElem = document.getElementById("current-question");
const totalQElem = document.getElementById("total-questions");

async function loadQuestions() {
  const response = await fetch("questions.json");
  quizData = await response.json();
  totalQElem.textContent = quizData.length;
  showQuestion();
}

function updateScoreboard() {
  rightScoreElem.textContent = rightScore;
  wrongScoreElem.textContent = wrongScore;
  totalScoreElem.textContent = rightScore - wrongScore;
}

function showQuestion() {
  const current = quizData[currentIndex];

  currentQElem.textContent = currentIndex + 1;
  questionElem.textContent = current.question;
  formElem.innerHTML = "";
  feedbackElem.textContent = "";

  const alreadyAttempted = attemptedAnswers.hasOwnProperty(currentIndex);

  current.options.forEach((option, index) => {
    const label = document.createElement("label");
    const input = document.createElement("input");

    input.type = "radio";
    input.name = "option";
    input.value = option;
    input.id = "option-" + index;
    input.disabled = alreadyAttempted;

    if (alreadyAttempted && attemptedAnswers[currentIndex] === option) {
      input.checked = true;
    }

    label.htmlFor = input.id;
    label.textContent = option;

    formElem.appendChild(input);
    formElem.appendChild(label);
    formElem.appendChild(document.createElement("br"));
  });

  backBtn.style.display = currentIndex > 0 ? "inline-block" : "none";
  nextBtn.textContent = currentIndex < quizData.length - 1 ? "Next" : "Finish";
  updateScoreboard();
}

nextBtn.addEventListener("click", () => {
  if (attemptedAnswers.hasOwnProperty(currentIndex)) {
    if (currentIndex < quizData.length - 1) {
      currentIndex++;
      showQuestion();
    }
    return;
  }

  const selectedOption = document.querySelector('input[name="option"]:checked');

  if (!selectedOption) {
    feedbackElem.textContent = "Please select an option.";
    return;
  }

  const correctAnswer = quizData[currentIndex].answer;

  attemptedAnswers[currentIndex] = selectedOption.value;

  if (selectedOption.value === correctAnswer) {
    feedbackElem.style.color = "green";
    feedbackElem.textContent = "Correct! +1 point";
    rightScore++;
  } else {
    feedbackElem.style.color = "red";
    feedbackElem.textContent = "Incorrect. -1 point";
    wrongScore++;
  }

  updateScoreboard();

  setTimeout(() => {
    if (currentIndex < quizData.length - 1) {
      currentIndex++;
      showQuestion();
    } else {
      questionElem.textContent = "Quiz Completed!";
      formElem.innerHTML = "";
      feedbackElem.textContent = "";
      nextBtn.style.display = "none";
      backBtn.style.display = "none";
    }
  }, 1000);
});

backBtn.addEventListener("click", () => {
  if (currentIndex > 0) {
    currentIndex--;
    showQuestion();
  }
});

const submitBtn = document.getElementById("submit-btn");
const summaryElem = document.getElementById("summary");

submitBtn.addEventListener("click", () => {
  let attempted = Object.keys(attemptedAnswers).length;
  let total = quizData.length;

  let correct = rightScore;
  let incorrect = wrongScore;

  let percentAttemptAccuracy = attempted > 0
    ? ((correct / attempted) * 100).toFixed(2)
    : "0.00";

  let percentTotalAccuracy = ((correct / total) * 100).toFixed(2);

  summaryElem.innerHTML = `
    <h3>📊 Quiz Summary</h3>
    <ul>
      <li>Total Questions: ${total}</li>
      <li>Attempted: ${attempted}</li>
      <li>✅ Correct: ${correct}</li>
      <li>❌ Incorrect: ${incorrect}</li>
      <li>🎯 Accuracy (Attempted): ${percentAttemptAccuracy}%</li>
      <li>📘 Accuracy (Total): ${percentTotalAccuracy}%</li>
    </ul>
  `;

  // Optionally disable quiz interactions after submit
  nextBtn.disabled = true;
  backBtn.disabled = true;
  submitBtn.disabled = true;
});


loadQuestions();
