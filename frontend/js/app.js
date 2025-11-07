// Main Application JavaScript
class ChemLabApp {
    constructor() {
        this.currentUser = null;
        this.currentSection = 'dashboard';
        this.userStats = {
            xp: 0,
            level: 1,
            coins: 100,
            badges: ['scientist-rookie']
        };
        
        this.init();
    }

    init() {
        // Check for auto-login parameters
        const urlParams = new URLSearchParams(window.location.search);
        const autoLogin = urlParams.get('login');
        
        if (autoLogin) {
            // Skip loading screen for auto-login
            this.hideLoadingScreen();
            this.showApp();
        } else {
            this.showLoadingScreen();
            // Simulate loading time
            setTimeout(() => {
                this.hideLoadingScreen();
                this.showLoginModal();
            }, 3000);
        }
        
        this.setupEventListeners();
        this.loadUserData();
    }

    showLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        const progressBar = loadingScreen.querySelector('.loading-progress');
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
            }
            progressBar.style.width = progress + '%';
        }, 200);
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }

    showLoginModal() {
        const modal = document.getElementById('login-modal');
        modal.classList.add('active');
    }

    hideLoginModal() {
        const modal = document.getElementById('login-modal');
        modal.classList.remove('active');
        this.showApp();
    }

    showApp() {
        const app = document.getElementById('app');
        app.style.display = 'flex';
        app.classList.add('animate-fadeIn');
        this.updateUserInterface();
    }

    setupEventListeners() {
        // Navigation buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = e.target.dataset.section;
                this.openSection(section);
            });
        });

        // Login form
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Guest login
        document.getElementById('guest-login').addEventListener('click', () => {
            this.handleGuestLogin();
        });

        // Grade selector
        document.querySelectorAll('.grade-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectGrade(e.target.dataset.grade);
            });
        });

        // Experiment cards
        document.querySelectorAll('.start-experiment-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const experimentCard = e.target.closest('.experiment-card');
                const experimentType = experimentCard.dataset.experiment;
                this.startExperiment(experimentType);
            });
        });

        // Game cards
        document.querySelectorAll('.play-game-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const gameCard = e.target.closest('.game-card');
                const gameType = gameCard.dataset.game;
                this.startGame(gameType);
            });
        });

        // Quiz buttons
        document.querySelectorAll('.start-quiz-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const quizType = e.target.dataset.type;
                this.startQuiz(quizType);
            });
        });
    }

    handleLogin() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const userType = document.querySelector('input[name="userType"]:checked').value;

        // Simulate login process
        this.currentUser = {
            username: username,
            type: userType,
            id: Date.now()
        };

        this.showNotification('Login berhasil! Selamat datang di ChemLab Academy', 'success');
        this.hideLoginModal();
    }

    handleGuestLogin() {
        this.currentUser = {
            username: 'Guest',
            type: 'guest',
            id: 'guest'
        };

        this.showNotification('Masuk sebagai tamu. Beberapa fitur terbatas.', 'info');
        this.hideLoginModal();
    }

    openSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });

        // Show selected section
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = sectionName;
        }

        // Update navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

        // Load section-specific content
        this.loadSectionContent(sectionName);
    }

    loadSectionContent(sectionName) {
        switch(sectionName) {
            case 'materials':
                this.loadMaterials();
                break;
            case 'lab':
                this.loadLabExperiments();
                break;
            case 'games':
                this.loadGames();
                break;
            case 'quiz':
                this.loadQuizzes();
                break;
        }
    }

    selectGrade(grade) {
        document.querySelectorAll('.grade-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-grade="${grade}"]`).classList.add('active');
        
        this.loadChapters(grade);
    }

    loadChapters(grade) {
        const chaptersContainer = document.getElementById('chapters-container');
        const chapters = this.getChaptersByGrade(grade);
        
        chaptersContainer.innerHTML = '';
        
        chapters.forEach((chapter, index) => {
            const chapterCard = this.createChapterCard(chapter, index);
            chaptersContainer.appendChild(chapterCard);
        });
    }

    getChaptersByGrade(grade) {
        const chaptersData = {
            '10': [
                { title: 'Struktur Atom', description: 'Pelajari struktur atom dan partikel penyusunnya', progress: 85 },
                { title: 'Sistem Periodik', description: 'Memahami tabel periodik unsur', progress: 60 },
                { title: 'Ikatan Kimia', description: 'Jenis-jenis ikatan kimia', progress: 30 },
                { title: 'Stoikiometri', description: 'Perhitungan kimia dasar', progress: 0 }
            ],
            '11': [
                { title: 'Termokimia', description: 'Energi dalam reaksi kimia', progress: 70 },
                { title: 'Laju Reaksi', description: 'Faktor yang mempengaruhi laju reaksi', progress: 45 },
                { title: 'Kesetimbangan Kimia', description: 'Prinsip kesetimbangan dalam reaksi', progress: 20 },
                { title: 'Asam Basa', description: 'Teori asam basa dan pH', progress: 0 }
            ],
            '12': [
                { title: 'Kimia Unsur', description: 'Sifat dan kegunaan unsur-unsur', progress: 55 },
                { title: 'Benzena dan Turunannya', description: 'Senyawa aromatik', progress: 25 },
                { title: 'Makromolekul', description: 'Polimer, protein, dan karbohidrat', progress: 10 },
                { title: 'Kimia dalam Kehidupan', description: 'Aplikasi kimia sehari-hari', progress: 0 }
            ]
        };
        
        return chaptersData[grade] || [];
    }

    createChapterCard(chapter, index) {
        const card = document.createElement('div');
        card.className = 'chapter-card animate-fadeIn';
        card.style.animationDelay = `${index * 0.1}s`;
        
        card.innerHTML = `
            <div class="chapter-content">
                <h3>${chapter.title}</h3>
                <p>${chapter.description}</p>
                <div class="chapter-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${chapter.progress}%"></div>
                    </div>
                    <span>${chapter.progress}%</span>
                </div>
                <button class="study-btn ${chapter.progress > 0 ? 'continue' : 'start'}">
                    ${chapter.progress > 0 ? 'Lanjutkan' : 'Mulai Belajar'}
                </button>
            </div>
        `;
        
        // Add click event
        card.querySelector('.study-btn').addEventListener('click', () => {
            this.startStudy(chapter);
        });
        
        return card;
    }

    startStudy(chapter) {
        this.showNotification(`Memulai pembelajaran: ${chapter.title}`, 'info');
        // Here you would implement the actual study interface
    }

    startExperiment(experimentType) {
        this.showNotification(`Memulai eksperimen: ${experimentType}`, 'info');
        // Initialize lab interface
        if (window.LabManager) {
            window.LabManager.startExperiment(experimentType);
        }
    }

    startGame(gameType) {
        this.showNotification(`Memulai game: ${gameType}`, 'info');
        // Initialize game
        if (window.GameManager) {
            window.GameManager.startGame(gameType);
        }
    }

    startQuiz(quizType) {
        this.showNotification(`Memulai quiz: ${quizType}`, 'info');
        // Initialize quiz
        if (window.QuizManager) {
            window.QuizManager.startQuiz(quizType);
        }
    }

    loadMaterials() {
        // Load default grade 10 materials
        this.loadChapters('10');
    }

    loadLabExperiments() {
        // Lab experiments are already loaded in HTML
        console.log('Lab experiments loaded');
    }

    loadGames() {
        // Games are already loaded in HTML
        console.log('Games loaded');
    }

    loadQuizzes() {
        // Quizzes are already loaded in HTML
        console.log('Quizzes loaded');
    }

    updateUserInterface() {
        // Update user stats display
        document.getElementById('user-xp').textContent = this.userStats.xp;
        document.getElementById('user-level').textContent = this.userStats.level;
        document.getElementById('user-coins').textContent = this.userStats.coins;
        
        // Update avatar if user is logged in
        if (this.currentUser && this.currentUser.username !== 'Guest') {
            // Set user-specific avatar
        }
    }

    addXP(amount) {
        this.userStats.xp += amount;
        
        // Check for level up
        const newLevel = Math.floor(this.userStats.xp / 1000) + 1;
        if (newLevel > this.userStats.level) {
            this.userStats.level = newLevel;
            this.showLevelUpAnimation();
            this.showNotification(`Selamat! Anda naik ke Level ${newLevel}!`, 'success');
        }
        
        // Show XP gain animation
        this.showXPGainAnimation(amount);
        this.updateUserInterface();
        this.saveUserData();
    }

    addCoins(amount) {
        this.userStats.coins += amount;
        this.updateUserInterface();
        this.saveUserData();
    }

    unlockBadge(badgeId) {
        if (!this.userStats.badges.includes(badgeId)) {
            this.userStats.badges.push(badgeId);
            this.showBadgeUnlockAnimation(badgeId);
            this.showNotification(`Badge baru terbuka: ${badgeId}!`, 'success');
            this.saveUserData();
        }
    }

    showXPGainAnimation(amount) {
        const xpElement = document.getElementById('user-xp');
        const rect = xpElement.getBoundingClientRect();
        
        const animationElement = document.createElement('div');
        animationElement.className = 'xp-gain-animation';
        animationElement.textContent = `+${amount} XP`;
        animationElement.style.left = rect.left + 'px';
        animationElement.style.top = rect.top + 'px';
        
        document.body.appendChild(animationElement);
        
        setTimeout(() => {
            document.body.removeChild(animationElement);
        }, 1500);
    }

    showLevelUpAnimation() {
        const levelElement = document.getElementById('user-level');
        levelElement.classList.add('level-up-animation');
        
        setTimeout(() => {
            levelElement.classList.remove('level-up-animation');
        }, 1000);
    }

    showBadgeUnlockAnimation(badgeId) {
        // Create badge unlock modal or animation
        console.log(`Badge unlocked: ${badgeId}`);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type} animate-slideInRight`;
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '1rem 2rem',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '500',
            zIndex: '1001',
            maxWidth: '300px'
        });
        
        // Set background color based on type
        const colors = {
            success: '#27ae60',
            error: '#e74c3c',
            warning: '#f39c12',
            info: '#3498db'
        };
        notification.style.background = colors[type] || colors.info;
        
        document.body.appendChild(notification);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.classList.add('animate-slideInRight');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    saveUserData() {
        if (this.currentUser && this.currentUser.id !== 'guest') {
            localStorage.setItem('chemlab_user_stats', JSON.stringify(this.userStats));
            localStorage.setItem('chemlab_current_user', JSON.stringify(this.currentUser));
        }
    }

    loadUserData() {
        const savedStats = localStorage.getItem('chemlab_user_stats');
        const savedUser = localStorage.getItem('chemlab_current_user');
        
        if (savedStats) {
            this.userStats = { ...this.userStats, ...JSON.parse(savedStats) };
        }
        
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
        }
    }
}

// Global functions for easy access
window.openSection = function(sectionName) {
    if (window.app) {
        window.app.openSection(sectionName);
    }
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new ChemLabApp();
});

// Add CSS for chapter cards
const chapterCardCSS = `
.chapter-card {
    background: rgba(255, 255, 255, 0.9);
    border-radius: 15px;
    padding: 1.5rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
}

.chapter-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.chapter-content h3 {
    color: #2c3e50;
    margin-bottom: 0.5rem;
}

.chapter-content p {
    color: #7f8c8d;
    margin-bottom: 1rem;
    font-size: 0.9rem;
}

.chapter-progress {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin: 1rem 0;
}

.study-btn {
    width: 100%;
    padding: 0.75rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.3s ease;
}

.study-btn.start {
    background: linear-gradient(135deg, #3498db, #2980b9);
    color: white;
}

.study-btn.continue {
    background: linear-gradient(135deg, #27ae60, #229954);
    color: white;
}

.study-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}
`;

// Add the CSS to the document
const style = document.createElement('style');
style.textContent = chapterCardCSS;
document.head.appendChild(style);