const topBar = document.getElementById('topBar');
const selectedNumbersDisplay = document.getElementById('selectedNumbers');
let selectedNumbers = [];
const balls = [];
const canvas = {
    width: window.innerWidth,
    height: window.innerHeight
};

// Create 10 balls for each number (0-9)
for (let num = 0; num <= 9; num++) {
    for (let i = 0; i < 10; i++) {
        createBall(num);
    }
}

function createBall(number) {
    const ball = document.createElement('div');
    ball.className = 'ball';
    ball.textContent = number;
    
    // Random position (avoiding top area)
    const x = Math.random() * (canvas.width - 40);
    const y = Math.random() * (canvas.height - 40 - 160) + 160;
    
    // Random velocity
    const vx = (Math.random() - 0.5) * 4;
    const vy = (Math.random() - 0.5) * 4;
    
    const ballData = {
        element: ball,
        number: number,
        x: x,
        y: y,
        vx: vx,
        vy: vy,
        active: true
    };
    
    balls.push(ballData);
    
    ball.style.left = x + 'px';
    ball.style.top = y + 'px';
    
    ball.addEventListener('click', () => {
        if (ballData.active && selectedNumbers.length < 10) {
            moveToTopBar(ballData);
        }
    });
    
    document.body.appendChild(ball);
}

function moveToTopBar(ballData) {
    if (!ballData.active) return;
    
    ballData.active = false;
    ballData.element.remove();
    
    const topBall = document.createElement('div');
    topBall.className = 'top-ball';
    topBall.textContent = ballData.number;
    
    // Add dashes after 3rd and 6th digits
    if (selectedNumbers.length === 3 || selectedNumbers.length === 6) {
        const dash = document.createElement('div');
        dash.className = 'phone-dash';
        dash.textContent = '-';
        topBar.appendChild(dash);
    }
    
    selectedNumbers.push(ballData.number);
    updateSelectedNumbersDisplay();
    
    topBall.addEventListener('click', () => {
        // Find this ball's position in the top bar
        const topBarElements = Array.from(topBar.children);
        const index = topBarElements.indexOf(topBall);
        
        // Remove the ball
        topBar.removeChild(topBall);
        
        // Find index in selectedNumbers
        const numIndex = selectedNumbers.indexOf(ballData.number);
        if (numIndex > -1) {
            selectedNumbers.splice(numIndex, 1);
        }
        
        // Check if we need to reorganize dashes
        reorganizeTopBar();
        updateSelectedNumbersDisplay();
        
        // Return the ball to the canvas
        createBall(ballData.number);
    });
    
    topBar.appendChild(topBall);
}

function reorganizeTopBar() {
    // Clear top bar
    while (topBar.firstChild) {
        topBar.removeChild(topBar.firstChild);
    }
    
    // Rebuild top bar with proper dashes
    for (let i = 0; i < selectedNumbers.length; i++) {
        // Add dash after 3rd and 6th positions
        if (i === 3 || i === 6) {
            const dash = document.createElement('div');
            dash.className = 'phone-dash';
            dash.textContent = '-';
            topBar.appendChild(dash);
        }
        
        const num = selectedNumbers[i];
        const topBall = document.createElement('div');
        topBall.className = 'top-ball';
        topBall.textContent = num;
        
        topBall.addEventListener('click', function() {
            // Store the number before removing the element
            const clickedNumber = Number(this.textContent);
            
            // Remove from DOM
            topBar.removeChild(this);
            
            // Find and remove from selectedNumbers
            const numIndex = selectedNumbers.indexOf(clickedNumber);
            if (numIndex > -1) {
                selectedNumbers.splice(numIndex, 1);
            }
            
            // Reorganize
            reorganizeTopBar();
            updateSelectedNumbersDisplay();
            
            // Return to canvas
            createBall(clickedNumber);
        });
        
        topBar.appendChild(topBall);
    }
}

function updateSelectedNumbersDisplay() {
    if (selectedNumbers.length === 0) {
        selectedNumbersDisplay.textContent = "None";
        return;
    }
    
    // Format as phone number with dashes
    let formattedNumber = "";
    for (let i = 0; i < selectedNumbers.length; i++) {
        formattedNumber += selectedNumbers[i];
        if (i === 2 || i === 5) {
            formattedNumber += "-";
        }
    }
    
    selectedNumbersDisplay.textContent = formattedNumber;
}

function update() {
    for (const ball of balls) {
        if (!ball.active) continue;
        
        // Update position
        ball.x += ball.vx;
        ball.y += ball.vy;
        
        // Bounce off walls
        if (ball.x <= 0 || ball.x >= canvas.width - 40) {
            ball.vx = -ball.vx;
            ball.x = Math.max(0, Math.min(ball.x, canvas.width - 40));
        }
        
        if (ball.y <= 160 || ball.y >= canvas.height - 40) {
            ball.vy = -ball.vy;
            ball.y = Math.max(160, Math.min(ball.y, canvas.height - 40));
        }
        
        // Update DOM element
        ball.element.style.left = ball.x + 'px';
        ball.element.style.top = ball.y + 'px';
    }
    
    requestAnimationFrame(update);
}

// Handle window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Start animation
update();