// Authentication Module
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.isLoggedIn = false;
    }

    // Guest login
    loginAsGuest() {
        this.currentUser = {
            id: 'guest',
            username: 'Tamu',
            type: 'student',
            xp: 0,
            level: 1,
            coins: 100
        };
        this.isLoggedIn = true;
        this.updateUI();
        this.hideLoginModal();
    }

    // Regular login
    login(username, password, userType) {
        // Simulate login (in real app, this would call backend)
        this.currentUser = {
            id: username,
            username: username,
            type: userType,
            xp: 1200,
            level: 5,
            coins: 250
        };
        this.isLoggedIn = true;
        this.updateUI();
        this.hideLoginModal();
    }

    // Update UI with user info
    updateUI() {
        if (this.currentUser) {
            document.getElementById('user-xp').textContent = this.currentUser.xp;
            document.getElementById('user-level').textContent = this.currentUser.level;
            document.getElementById('user-coins').textContent = this.currentUser.coins;
            
            // Show teacher navigation if user is teacher
            const teacherNav = document.getElementById('teacher-nav');
            if (this.currentUser.type === 'teacher') {
                teacherNav.style.display = 'block';
            } else {
                teacherNav.style.display = 'none';
            }
        }
    }

    // Logout function
    logout() {
        if (confirm('Apakah Anda yakin ingin keluar?')) {
            this.currentUser = null;
            this.isLoggedIn = false;
            
            // Clear localStorage
            localStorage.removeItem('chemlab_user_stats');
            localStorage.removeItem('chemlab_current_user');
            
            // Hide teacher navigation
            const teacherNav = document.getElementById('teacher-nav');
            if (teacherNav) {
                teacherNav.style.display = 'none';
            }
            
            // Hide app and show login modal
            const app = document.getElementById('app');
            if (app) {
                app.style.display = 'none';
            }
            
            // Reset to default dashboard
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.remove('active');
                section.style.display = 'none';
            });
            
            const dashboard = document.getElementById('dashboard');
            if (dashboard) {
                dashboard.classList.add('active');
                dashboard.style.display = 'block';
            }
            
            // Show login modal
            this.showLoginModal();
            
            // Reset URL
            window.history.replaceState({}, document.title, window.location.pathname);
            
            console.log('User logged out successfully');
        }
    }

    // Show/hide login modal
    showLoginModal() {
        document.getElementById('login-modal').style.display = 'flex';
    }

    hideLoginModal() {
        document.getElementById('login-modal').style.display = 'none';
    }
}

// Initialize auth manager
const authManager = new AuthManager();

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Check URL parameters for auto-login
    const urlParams = new URLSearchParams(window.location.search);
    const autoLogin = urlParams.get('login');
    
    if (autoLogin === 'teacher') {
        // Auto login as teacher
        console.log('Auto-login as teacher detected');
        authManager.login('Guru Demo', 'password', 'teacher');
        
        // Show app and then teacher dashboard
        setTimeout(() => {
            // Make sure app is visible
            const app = document.getElementById('app');
            if (app) {
                app.style.display = 'flex';
            }
            
            // Show teacher dashboard
            if (typeof teacherManager !== 'undefined') {
                console.log('Showing teacher dashboard automatically');
                teacherManager.showTeacherDashboard();
            } else {
                console.error('teacherManager not found');
            }
        }, 1000);
        return;
    } else if (autoLogin === 'student') {
        // Auto login as student
        console.log('Auto-login as student detected');
        authManager.login('Siswa Demo', 'password', 'student');
        
        // Show app
        setTimeout(() => {
            const app = document.getElementById('app');
            if (app) {
                app.style.display = 'flex';
            }
        }, 500);
        return;
    }

    // Show login modal on start
    authManager.showLoginModal();

    // Login form handler
    document.getElementById('login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const userType = document.querySelector('input[name="userType"]:checked').value;
        authManager.login(username, password, userType);
    });

    // Guest login handler
    document.getElementById('guest-login').addEventListener('click', function() {
        authManager.loginAsGuest();
    });
});