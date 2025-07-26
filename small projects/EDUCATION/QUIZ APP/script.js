let questions = [];
let currentQuestionIndex = 0;
let score = 0;

document.getElementById('startQuiz').addEventListener('click', loadQuestions);
document.getElementById('nextButton').addEventListener('click', nextQuestion);
document.getElementById('restartQuiz').addEventListener('click', restartQuiz);

function loadQuestions() {
    const fileInput = document.getElementById('fileInput');
    
    if (fileInput.files.length === 0) {
        alert("Please upload a JSON file.");
        return;
    }

    const file = fileInput.files[0];
    
    const reader = new FileReader();
    
    reader.onload = function(event) {
        try {
            questions = JSON.parse(event.target.result);
            questions = Object.values(questions); // Convert to array
            currentQuestionIndex = 0;
            score = 0;

            document.getElementById('quizContainer').classList.remove('hidden');
            document.getElementById('resultContainer').classList.add('hidden');
            displayQuestion();
        } catch (error) {
            alert("Error parsing JSON file.");
        }
    };

    reader.readAsText(file);
}

function displayQuestion() {
    const questionElement = document.getElementById('question');
    const optionsElement = document.getElementById('options');

    const currentQuestion = questions[currentQuestionIndex];
    
    questionElement.innerText = currentQuestion.Q;
    
    optionsElement.innerHTML = '';
    
    for (let i = 1; i <= 4; i++) {
        const optionButton = document.createElement('button');
        optionButton.innerText = currentQuestion[`O${i}`];
        optionButton.addEventListener('click', () => selectOption(currentQuestion[`O${i}`], currentQuestion.A));
        optionsElement.appendChild(optionButton);
    }
}

function selectOption(selectedOption, correctAnswer) {
    if (selectedOption === correctAnswer) {
        score++;
    }

    currentQuestionIndex++;
    
    if (currentQuestionIndex < questions.length) {
        displayQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    document.getElementById('quizContainer').classList.add('hidden');
    
    const resultText = document.getElementById('resultText');
    resultText.innerText = `You scored ${score} out of ${questions.length}`;
    
    document.getElementById('resultContainer').classList.remove('hidden');
}

function restartQuiz() {
    document.getElementById('resultContainer').classList.add('hidden');
}