// setup canvas
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);
// function to generate random number
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
// function to generate random color
function randomRGB() {
  return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

// Ball class definition
class Ball {
  constructor(x, y, velX, velY, color, size) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.color = color;
    this.size = size;
    this.mass = size; // Mass proportional to size for physics calculations
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }

  update() {
    if (this.x + this.size >= width) {
      this.velX = -this.velX;
    }

    if (this.x - this.size <= 0) {
      this.velX = -this.velX;
    }

    if (this.y + this.size >= height) {
      this.velY = -this.velY;
    }

    if (this.y - this.size <= 0) {
      this.velY = -this.velY;
    }

    this.x += this.velX;
    this.y += this.velY;
  }

  collisionDetect() {
    for (const ball of balls) {
      if (this !== ball) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.size + ball.size) {
          // Collision detected - implement realistic bouncing physics
          
          // Calculate unit normal vector (direction of collision)
          const nx = dx / distance;
          const ny = dy / distance;
          
          // Calculate relative velocity
          const vx = this.velX - ball.velX;
          const vy = this.velY - ball.velY;
          
          // Calculate velocity along the normal direction (dot product)
          const velocityAlongNormal = vx * nx + vy * ny;
          
          // No need to process if objects are moving away from each other
          if (velocityAlongNormal > 0) return;
          
          // Calculate restitution (bounciness factor)
          const restitution = 0.9;
          
          // Calculate impulse scalar
          const impulseScalar = -(1 + restitution) * velocityAlongNormal / 
                               (1/this.mass + 1/ball.mass);
          
          // Apply impulse to velocities
          const impulseX = impulseScalar * nx;
          const impulseY = impulseScalar * ny;
          
          // Update velocities based on mass
          this.velX += impulseX / this.mass;
          this.velY += impulseY / this.mass;
          ball.velX -= impulseX / ball.mass;
          ball.velY -= impulseY / ball.mass;
          
          // Prevent balls from sticking together by slightly separating them
          const overlap = (this.size + ball.size - distance) / 2;
          this.x += overlap * nx;
          this.y += overlap * ny;
          ball.x -= overlap * nx;
          ball.y -= overlap * ny;
        }
      }
    }
  }
}

// Create balls array
const balls = [];

while (balls.length < 25) {
  const size = random(10, 20);
  const ball = new Ball(
    // ball position always drawn at least one ball width
    // away from the edge of the canvas, to avoid drawing errors
    random(0 + size, width - size),
    random(0 + size, height - size),
    random(-7, 7),
    random(-7, 7),
    randomRGB(),
    size
  );

  balls.push(ball);
}

// Animation loop function
function loop() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
  ctx.fillRect(0, 0, width, height);

  for (const ball of balls) {
    ball.draw();
    ball.update();
    ball.collisionDetect();
  }

  requestAnimationFrame(loop);
}

// Start the animation
loop();