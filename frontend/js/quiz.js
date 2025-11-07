// Quiz Module
class QuizManager {
    constructor() {
        this.questions = [
            {
                question: "Apa simbol kimia untuk emas?",
                options: ["Au", "Ag", "Fe", "Cu"],
                correct: 0
            },
            {
                question: "Berapa nomor atom hidrogen?",
                options: ["1", "2", "3", "4"],
                correct: 0
            },
            {
                question: "Apa rumus kimia air?",
                options: ["H2O", "CO2", "NaCl", "CH4"],
                correct: 0
            },
            {
                question: "Gas apa yang paling banyak di atmosfer?",
                options: ["Oksigen", "Nitrogen", "Karbon dioksida", "Argon"],
                correct: 1
            },
            {
                question: "Apa nama proses perubahan dari padat ke gas?",
                options: ["Mencair", "Menguap", "Sublimasi", "Kondensasi"],
                correct: 2
            }
        ];
        this.currentQuiz = null;
        this.currentQuestionIndex = 0;
        this.score = 0;
    }

    // Start quiz
    startQuiz(type) {
        this.currentQuiz = type;
        this.currentQuestionIndex = 0;
        this.score = 0;

        const questionCount = type === 'quick' ? 3 : 5;
        const selectedQuestions = this.questions.slice(0, questionCount);

        this.showQuizModal(selectedQuestions);
    }

    // Show quiz modal
    showQuizModal(questions) {
        // Create quiz modal
        const modal = document.createElement('div');
        modal.className = 'modal quiz-modal';
        modal.innerHTML = `
            <div class="modal-content quiz-content">
                <div class="quiz-header">
                    <h3>Quiz Kimia</h3>
                    <div class="quiz-progress">
                        <span id="question-counter">1 / ${questions.length}</span>
                        <div class="progress-bar">
                            <div class="progress-fill" id="quiz-progress" style="width: 0%"></div>
                        </div>
                    </div>
                </div>
                <div class="quiz-body">
                    <div class="question" id="quiz-question">
                        ${questions[0].question}
                    </div>
                    <div class="options" id="quiz-options">
                        ${questions[0].options.map((option, index) => 
                            `<button class="option-btn" data-index="${index}">${option}</button>`
                        ).join('')}
                    </div>
                </div>
                <div class="quiz-footer">
                    <button id="next-question" style="display: none;">Pertanyaan Selanjutnya</button>
                    <button id="finish-quiz" style="display: none;">Selesai</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        modal.style.display = 'flex';

        this.setupQuizEvents(questions, modal);
    }

    // Setup quiz event listeners
    setupQuizEvents(questions, modal) {
        const optionButtons = modal.querySelectorAll('.option-btn');
        const nextButton = modal.querySelector('#next-question');
        const finishButton = modal.querySelector('#finish-quiz');

        optionButtons.forEach(button => {
            button.addEventListener('click', () => {
                const selectedIndex = parseInt(button.dataset.index);
                const isCorrect = selectedIndex === questions[this.currentQuestionIndex].correct;

                // Disable all buttons
                optionButtons.forEach(btn => btn.disabled = true);

                // Show correct/incorrect
                if (isCorrect) {
                    button.classList.add('correct');
                    this.score++;
                } else {
                    button.classList.add('incorrect');
                    optionButtons[questions[this.currentQuestionIndex].correct].classList.add('correct');
                }

                // Show next button or finish button
                if (this.currentQuestionIndex < questions.length - 1) {
                    nextButton.style.display = 'block';
                } else {
                    finishButton.style.display = 'block';
                }
            });
        });

        nextButton.addEventListener('click', () => {
            this.currentQuestionIndex++;
            this.showNextQuestion(questions, modal);
        });

        finishButton.addEventListener('click', () => {
            this.finishQuiz(questions.length, modal);
        });
    }

    // Show next question
    showNextQuestion(questions, modal) {
        const question = questions[this.currentQuestionIndex];
        
        modal.querySelector('#quiz-question').textContent = question.question;
        modal.querySelector('#question-counter').textContent = `${this.currentQuestionIndex + 1} / ${questions.length}`;
        modal.querySelector('#quiz-progress').style.width = `${((this.currentQuestionIndex + 1) / questions.length) * 100}%`;

        const optionsContainer = modal.querySelector('#quiz-options');
        optionsContainer.innerHTML = question.options.map((option, index) => 
            `<button class="option-btn" data-index="${index}">${option}</button>`
        ).join('');

        modal.querySelector('#next-question').style.display = 'none';

        // Re-setup option events
        this.setupQuizEvents(questions, modal);
    }

    // Finish quiz
    finishQuiz(totalQuestions, modal) {
        const percentage = Math.round((this.score / totalQuestions) * 100);
        const xpReward = this.score * 20;

        // Update user stats
        if (authManager.currentUser) {
            authManager.currentUser.xp += xpReward;
            authManager.currentUser.coins += this.score * 5;
            authManager.updateUI();
        }

        // Show results
        modal.querySelector('.quiz-content').innerHTML = `
            <div class="quiz-results">
                <h3>Quiz Selesai!</h3>
                <div class="results-stats">
                    <div class="stat">
                        <span class="stat-label">Skor:</span>
                        <span class="stat-value">${this.score}/${totalQuestions}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Persentase:</span>
                        <span class="stat-value">${percentage}%</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">XP Diperoleh:</span>
                        <span class="stat-value">+${xpReward}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Koin Diperoleh:</span>
                        <span class="stat-value">+${this.score * 5}</span>
                    </div>
                </div>
                <button id="close-quiz">Tutup</button>
            </div>
        `;

        modal.querySelector('#close-quiz').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
    }
}

// Initialize quiz manager
const quizManager = new QuizManager();

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.start-quiz-btn').forEach(button => {
        button.addEventListener('click', function() {
            const quizType = this.dataset.type;
            quizManager.startQuiz(quizType);
        });
    });
});