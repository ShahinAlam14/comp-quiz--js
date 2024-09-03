document.addEventListener('DOMContentLoaded', async function() {
    const questionElement = document.getElementById('question');
    const answerButtons = document.querySelectorAll('.answer-btn');
    const statusElement = document.getElementById('status');

    let questions = [];
    let currentQuestionIndex = 0;

    async function fetchQuestions() {
        try {
            const response = await fetch('https://opentdb.com/api.php?amount=12&category=18&difficulty=medium&type=multiple');
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            return data.results.map(item => ({
                question: item.question,
                answers: [...item.incorrect_answers, item.correct_answer].sort(() => Math.random() - 0.5),
                correct: item.correct_answer
            }));
        } catch (error) {
            console.error('Error fetching questions:', error);
            statusElement.textContent = 'Failed to load questions.';
            return [];
        }
    }

    function showQuestion() {
        if (currentQuestionIndex >= questions.length) {
            statusElement.textContent = 'Quiz completed!';
            return;
        }

        const currentQuestion = questions[currentQuestionIndex];
        questionElement.innerHTML = currentQuestion.question;
        answerButtons.forEach((button, index) => {
            button.textContent = currentQuestion.answers[index];
            button.onclick = () => checkAnswer(button.textContent);
        });
    }

    function checkAnswer(selectedAnswer) {
        const correctAnswer = questions[currentQuestionIndex].correct;
        if (selectedAnswer === correctAnswer) {
            statusElement.textContent = 'Correct!';
        } else {
            statusElement.textContent = `Wrong answer. The correct answer was ${correctAnswer}.`;
        }
        currentQuestionIndex++;
        setTimeout(showQuestion, 2000);
    }

    // Fetch questions and start the quiz
    questions = await fetchQuestions();
    if (questions.length > 0) {
        showQuestion();
    }
});
