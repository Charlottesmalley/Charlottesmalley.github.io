
const selectedNumbersDisplay = document.getElementById('selectedNumbers');
const clearButton = document.getElementById('clearButton');
const submitButton = document.getElementById('submitButton');
const messageBox = document.getElementById('messageBox');
const closeMessage = document.getElementById('closeMessage');

let selectedNumbers = [];
const balls = [];
const canvas = {
    width: window.innerWidth,
    height: window.innerHeight
};

// ball physics
const BALL_RADIUS = 35;
const BALL_DIAMETER = BALL_RADIUS * 2;
const COLLISION_DAMPING = 0.8;
const VELOCITY_MULTIPLIER = 2.0; // Increased velocity

// number of balls
for (let num = 0; num <= 9; num++) {
    for (let i = 0; i < 5; i++) {
        createBall(num);
    }
}

function createBall(number) {
    const ball = document.createElement('div');
    ball.className = 'ball';
    ball.setAttribute('data-number', number);
    ball.textContent = number;
    
    // Random position for balls 
    const x = Math.random() * (canvas.width - BALL_DIAMETER);
    const y = Math.random() * (canvas.height - BALL_DIAMETER - 60) + 60;
    
    // speed of balls 
    const vx = (Math.random() - 0.5) * 14 * VELOCITY_MULTIPLIER; 
    const vy = (Math.random() - 0.5) * 14 * VELOCITY_MULTIPLIER; 
    
    const ballData = {
        element: ball,
        number: number,
        x: x,
        y: y,
        vx: vx,
        vy: vy,
        radius: BALL_RADIUS,
        active: true
    };
    
    balls.push(ballData);
    
    ball.style.left = x + 'px';
    ball.style.top = y + 'px';
    
    ball.addEventListener('click', () => {
        if (ballData.active && selectedNumbers.length < 10) {
            selectNumber(ballData);
        }
    });
    
    document.body.appendChild(ball);
}

function selectNumber(ballData) {
    if (!ballData.active) return;
    
    selectedNumbers.push(ballData.number);
    
    // Add dashes to phone number 
    updateSelectedNumbersDisplay();
    

    ballData.element.remove();
    const index = balls.indexOf(ballData);
    if (index > -1) {
        balls.splice(index, 1);
    }
}

function updateSelectedNumbersDisplay() {
    if (selectedNumbers.length === 0) {
        selectedNumbersDisplay.textContent = "None";
        return;
    }
    
   
    let formattedNumber = "";
    for (let i = 0; i < selectedNumbers.length; i++) {
        formattedNumber += selectedNumbers[i];
        if (i === 2 || i === 5) {
            formattedNumber += "-";
        }
    }
    
    selectedNumbersDisplay.textContent = formattedNumber;
}

// submit the phone number
function submitPhoneNumber() {
    if (selectedNumbers.length > 0) {
        messageBox.classList.remove('hidden');
    }
}

// close the message box
function closeMessageBox() {
    messageBox.classList.add('hidden');
}

// clear the phone number
function clearPhoneNumber() {
    selectedNumbers = [];
    updateSelectedNumbersDisplay();
    
    // Re make balls for numbers that were selected

    const currentCounts = {};
    for (let i = 0; i <= 9; i++) {
        currentCounts[i] = 0;
    }
    
    for (const ball of balls) {
        currentCounts[ball.number]++;
    }
  
    for (let num = 0; num <= 9; num++) {
        const missingCount = 5 - currentCounts[num]; // Changed from 10 to 5
        for (let i = 0; i < missingCount; i++) {
            createBall(num);
        }
    }
}

function distance(ball1, ball2) {
    const dx = ball1.x - ball2.x;
    const dy = ball1.y - ball2.y;
    return Math.sqrt(dx * dx + dy * dy);
}

function checkCollision(ball1, ball2) {
    const dist = distance(ball1, ball2);
    return dist < ball1.radius + ball2.radius;
}

function resolveCollision(ball1, ball2) {
    // collision of balls 
    const dx = ball2.x - ball1.x;
    const dy = ball2.y - ball1.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
  
    const nx = dx / dist;
    const ny = dy / dist;
    
  
    const relVelX = ball2.vx - ball1.vx;
    const relVelY = ball2.vy - ball1.vy;
    
    const relVelNormal = relVelX * nx + relVelY * ny;
    if (relVelNormal > 0) return;
    
   
    const impulse = 2 * relVelNormal / 2;
    
    //bump 
    ball1.vx += impulse * nx * COLLISION_DAMPING;
    ball1.vy += impulse * ny * COLLISION_DAMPING;
    ball2.vx -= impulse * nx * COLLISION_DAMPING;
    ball2.vy -= impulse * ny * COLLISION_DAMPING;
    
    // Swap numbers
    const tempNumber = ball1.number;
    ball1.number = ball2.number;
    ball2.number = tempNumber;
    
    ball1.element.textContent = ball1.number;
    ball2.element.textContent = ball2.number;
    ball1.element.setAttribute('data-number', ball1.number);
    ball2.element.setAttribute('data-number', ball2.number);
    
    // Move balls 
    const overlap = ball1.radius + ball2.radius - dist;
    if (overlap > 0) {
        const moveX = (overlap / 2) * nx;
        const moveY = (overlap / 2) * ny;
        
        ball1.x -= moveX;
        ball1.y -= moveY;
        ball2.x += moveX;
        ball2.y += moveY;
    }
}

// Function to reset velocity of all balls with soace bar 
function resetVelocity() {
    for (const ball of balls) {
        
        ball.vx = (Math.random() - 0.5) * 20 * VELOCITY_MULTIPLIER;
        ball.vy = (Math.random() - 0.5) * 20 * VELOCITY_MULTIPLIER;
    }
}

function update() {
   
    for (const ball of balls) {
        ball.x += ball.vx;
        ball.y += ball.vy;
        
        // Bounce off walls
        if (ball.x <= 0 || ball.x >= canvas.width - BALL_DIAMETER) {
            ball.vx = -ball.vx;
            ball.x = Math.max(0, Math.min(ball.x, canvas.width - BALL_DIAMETER));
        }
        
        if (ball.y <= 60 || ball.y >= canvas.height - BALL_DIAMETER) {
            ball.vy = -ball.vy;
            ball.y = Math.max(60, Math.min(ball.y, canvas.height - BALL_DIAMETER));
        }
        
       
        ball.element.style.left = ball.x + 'px';
        ball.element.style.top = ball.y + 'px';
    }
    
    // look for collisions
    for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
            if (checkCollision(balls[i], balls[j])) {
                resolveCollision(balls[i], balls[j]);
            }
        }
    }
    
    requestAnimationFrame(update);
}

//window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Add spacebar function 
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        resetVelocity();
        event.preventDefault(); 
    }
});

// Add button listeners 
clearButton.addEventListener('click', clearPhoneNumber);
submitButton.addEventListener('click', submitPhoneNumber);
closeMessage.addEventListener('click', closeMessageBox);


update();