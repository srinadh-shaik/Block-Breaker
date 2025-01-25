//userintro 




const grid = document.querySelector('.grid');
const scoreDisplay = document.querySelector('#score');
const blockWidth = 100;
const blockHeight = 20;
const ballDiameter = 20;
const boardWidth = 560;
const boardHeight = 300;

const paddleSpeed = 10; // Speed of paddle movement
const ballSpeed = 5; // Speed of ball movement
let xDirection = -ballSpeed;
let yDirection = ballSpeed;

const userStart = [230, 10];
let currentPosition = [...userStart];

const ballStart = [270, 40];
let ballCurrentPosition = [...ballStart];

let timerId;
let score = 0;

// Block class for modular block creation
class Block {
  constructor(xAxis, yAxis) {
    this.bottomLeft = [xAxis, yAxis];
    this.bottomRight = [xAxis + blockWidth, yAxis];
    this.topRight = [xAxis + blockWidth, yAxis + blockHeight];
    this.topLeft = [xAxis, yAxis + blockHeight];
  }
}

// Create blocks in a modular manner
const createBlocks = () => {
  const blocks = [];
  for (let y = 270; y >= 210; y -= 30) {
    for (let x = 10; x <= 450; x += 110) {
      blocks.push(new Block(x, y));
    }
  }
  return blocks;
};

const blocks = createBlocks();

// Draw blocks dynamically
function addBlocks() {
  blocks.forEach((block) => {
    const blockElement = document.createElement('div');
    blockElement.classList.add('block');
    blockElement.style.left = `${block.bottomLeft[0]}px`;
    blockElement.style.bottom = `${block.bottomLeft[1]}px`;
    grid.appendChild(blockElement);
  });
}
addBlocks();

// Add paddle
const user = document.createElement('div');
user.classList.add('user');
grid.appendChild(user);
drawUser();

// Add ball
const ball = document.createElement('div');
ball.classList.add('ball');
grid.appendChild(ball);
drawBall();

// Draw paddle at the current position
function drawUser() {
  user.style.left = `${currentPosition[0]}px`;
  user.style.bottom = `${currentPosition[1]}px`;
}

// Draw ball at the current position
function drawBall() {
  ball.style.left = `${ballCurrentPosition[0]}px`;
  ball.style.bottom = `${ballCurrentPosition[1]}px`;
}

// Handle paddle movement
function moveUser(e) {
  if (e.key === 'ArrowLeft' && currentPosition[0] > 0) {
    currentPosition[0] -= paddleSpeed;
    drawUser();
  } else if (e.key === 'ArrowRight' && currentPosition[0] < boardWidth - blockWidth) {
    currentPosition[0] += paddleSpeed;
    drawUser();
  }
}
document.addEventListener('keydown', moveUser);

// Move the ball
function moveBall() {
  ballCurrentPosition[0] += xDirection;
  ballCurrentPosition[1] += yDirection;
  drawBall();
  checkForCollisions();
}
timerId = setInterval(moveBall, 30);

// Check for collisions with blocks, walls, paddle, or the bottom
function checkForCollisions() {
  // Check for block collision
  blocks.forEach((block, i) => {
    if (
      ballCurrentPosition[0] > block.bottomLeft[0] &&
      ballCurrentPosition[0] < block.bottomRight[0] &&
      ballCurrentPosition[1] + ballDiameter > block.bottomLeft[1] &&
      ballCurrentPosition[1] < block.topLeft[1]
    ) {
      const allBlocks = Array.from(document.querySelectorAll('.block'));
      allBlocks[i].classList.remove('block');
      blocks.splice(i, 1);
      changeDirection();
      score++;
      scoreDisplay.innerHTML = score;
      if (blocks.length === 0) {
        endGame('You Win!');
      }
    }
  });

  // Check for wall collisions
  if (
    ballCurrentPosition[0] >= boardWidth - ballDiameter || 
    ballCurrentPosition[0] <= 0
  ) {
    xDirection *= -1;
  }
  if (ballCurrentPosition[1] >= boardHeight - ballDiameter) {
    yDirection *= -1;
  }

  // Check for paddle collision
  if (
    ballCurrentPosition[0] > currentPosition[0] &&
    ballCurrentPosition[0] < currentPosition[0] + blockWidth &&
    ballCurrentPosition[1] > currentPosition[1] &&
    ballCurrentPosition[1] < currentPosition[1] + blockHeight
  ) {
    yDirection *= -1;
  }

  // Check for game over
  if (ballCurrentPosition[1] <= 0) {
    endGame('You Lose!');
  }
}

// Change ball direction dynamically
function changeDirection() {
  yDirection *= -1;
}

// End the game
function endGame(message) {
  clearInterval(timerId);
  scoreDisplay.innerHTML = message;
  document.removeEventListener('keydown', moveUser);
}

// Reset game (optional improvement)
function resetGame() {
  clearInterval(timerId);
  blocks.splice(0, blocks.length, ...createBlocks());
  addBlocks();
  currentPosition = [...userStart];
  ballCurrentPosition = [...ballStart];
  drawUser();
  drawBall();
  score = 0;
  scoreDisplay.innerHTML = score;
  timerId = setInterval(moveBall, 30);
}
