// Game state variables
let moves = 0;
let matches = 0;
let gameStarted = false;
let gameTime = 0;
let timerInterval;
let flippedCards = [];
let lockBoard = false;

// Card data pairs of shapes and colors
const cardTypes = [
    { shape: 'square', color: 'red' },
    { shape: 'square', color: 'blue' },
    { shape: 'circle', color: 'green' },
    { shape: 'circle', color: 'yellow' },
    { shape: 'triangle', color: 'red' },
    { shape: 'triangle', color: 'blue' },
    { shape: 'star', color: 'green' },
    { shape: 'star', color: 'yellow' }
];

// Initialize game
document.addEventListener('DOMContentLoaded', () => {
    initGame();
    
    // Event listeners
    document.getElementById('restart-btn').addEventListener('click', restartGame);
    document.getElementById('play-again-btn').addEventListener('click', restartGame);
});

// Function to initialize the game
function initGame() {
    const gameGrid = document.getElementById('game-grid');
    gameGrid.innerHTML = '';
    
    // Create cards array with pairs
    let cards = [];
    
    // Create two of each card type for matching
    cardTypes.forEach(cardType => {
        
        cards.push({
            shape: cardType.shape,
            color: cardType.color,
            id: `${cardType.shape}-${cardType.color}-1`
        });
        
        
        cards.push({
            shape: cardType.shape,
            color: cardType.color,
            id: `${cardType.shape}-${cardType.color}-2`
        });
    });
    
  
    cards = shuffleArray(cards);
    
    cards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        cardElement.dataset.cardId = card.id;
        cardElement.dataset.shape = card.shape;
        cardElement.dataset.color = card.color;
        
        // card back 
        const cardBack = document.createElement('div');
        cardBack.className = 'card-back';
        
        // Create frount 
        const cardContent = document.createElement('div');
        cardContent.className = 'card-content';
        
        const shape = document.createElement('div');
        shape.className = `shape ${card.shape} ${card.color}`;
        
        cardContent.appendChild(shape);
        cardElement.appendChild(cardBack);
        cardElement.appendChild(cardContent);
        
        cardElement.addEventListener('click', flipCard);
        
        gameGrid.appendChild(cardElement);
    });
    
    // Reset stats
    moves = 0;
    matches = 0;
    gameStarted = false;
    gameTime = 0;
    flippedCards = [];
    lockBoard = false;
    
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    
    // Update 
    updateStats();
}


function shuffleArray(array) {
    const newArray = [...array]; 
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Card flip handler
function flipCard() {
   
    if (lockBoard) return;
    if (this.classList.contains('flipped') || this.classList.contains('matched')) return;
    
    // Start timer on first move
    if (!gameStarted) {
        startTimer();
        gameStarted = true;
    }
    
    // Flip the card
    this.classList.add('flipped');
    
    if (flippedCards.length === 0) {
        // First card flipped
        flippedCards.push(this);
    } else {
        // Second card flipped
        moves++;
        updateStats();
        
        const firstCardShape = flippedCards[0].dataset.shape;
        const firstCardColor = flippedCards[0].dataset.color;
        const secondCardShape = this.dataset.shape;
        const secondCardColor = this.dataset.color;
        
        // Check if cards match 
        if (firstCardShape === secondCardShape && 
            firstCardColor === secondCardColor && 
            flippedCards[0].dataset.cardId !== this.dataset.cardId) {
            
            matches++;
            updateStats();
            
            // Mark cards as matched
            flippedCards[0].classList.add('matched');
            this.classList.add('matched');
            
            // Remove event listeners from matched cards
            flippedCards[0].removeEventListener('click', flipCard);
            this.removeEventListener('click', flipCard);
            
          
            flippedCards = [];
            
            // Check if game is won
            if (matches === cardTypes.length) {
                endGame();
            }
        } else {
        
            lockBoard = true;
            
            // Flip back
            setTimeout(() => {
                flippedCards[0].classList.remove('flipped');
                this.classList.remove('flipped');
                flippedCards = [];
                lockBoard = false;
            }, 1000);
        }
    }
}


function updateStats() {
    document.getElementById('moves').textContent = moves;
    document.getElementById('matches').textContent = matches;
    document.getElementById('time').textContent = gameTime;
}

// Start timer
function startTimer() {
    timerInterval = setInterval(() => {
        gameTime++;
        document.getElementById('time').textContent = gameTime;
    }, 1000);
}

// End game
function endGame() {
    clearInterval(timerInterval);
    
    document.getElementById('final-moves').textContent = moves;
    document.getElementById('final-time').textContent = gameTime;
    
    // Show win message
    setTimeout(() => {
        document.getElementById('win-message').style.display = 'block';
    }, 500);
}

// Restart game
function restartGame() {
    document.getElementById('win-message').style.display = 'none';
    initGame();
}