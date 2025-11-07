// Games Module
class GameManager {
    constructor() {
        this.games = {
            'periodic-puzzle': {
                name: 'Periodic Puzzle',
                description: 'Susun tabel periodik dengan benar',
                xpReward: 50
            },
            'chem-match': {
                name: 'Chem Match',
                description: 'Cocokkan molekul dengan namanya',
                xpReward: 30
            }
        };
    }

    // Start a game
    startGame(gameId) {
        const game = this.games[gameId];
        if (!game) return;

        alert(`Memulai ${game.name}!\n\nIni adalah demo. Game akan dikembangkan lebih lanjut.\n\nReward: ${game.xpReward} XP`);
        
        // Simulate game completion and reward
        this.completeGame(gameId);
    }

    // Complete game and give rewards
    completeGame(gameId) {
        const game = this.games[gameId];
        if (authManager.currentUser) {
            authManager.currentUser.xp += game.xpReward;
            authManager.currentUser.coins += 10;
            authManager.updateUI();
        }
    }
}

// Initialize game manager
const gameManager = new GameManager();

// Event listeners for game buttons
document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners to play game buttons
    document.querySelectorAll('.play-game-btn').forEach(button => {
        button.addEventListener('click', function() {
            const gameCard = this.closest('.game-card');
            const gameId = gameCard.dataset.game;
            gameManager.startGame(gameId);
        });
    });
});