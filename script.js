const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
let x = canvas.width / 2; // Startposition for x
let y = canvas.height - 50; // Startposition for y
let dx = 2; // Start velocity for x axis
let dy = -2; // Start velocity for y axis
const ballRadius = 5;  // radius of ball
let paddleHeight = 10;  // How tall the gamebar is
let paddleWidth = 60; // How wide the gamebar is
let paddleX = (canvas.width - paddleWidth) * 3 / 4;  // Starting position for paddle 
let paddleY = canvas.height - paddleHeight - 40;  //
let rightPressed = false;  // check for user input right arrow
let leftPressed = false;  // check for user input left arrow
let downPressed = false;  // check for user input right arrow
let upPressed = false;  // check for user input left arrow
let brickRowCount = 7;  // amount of rows to be drawn in canvas
let brickColumnCount = 14;  // amount of columns to be drawn in canvas
const brickWidth = 25;  //  Positioning and size for Bricks
const brickHeight = 12.5; // 
let brickPadding = 5; // 
let brickOffsetTop = 30; //
const brickOffsetTopAdder = 5 
let brickOffsetLeft = 40; // 
const colors = ["rgb(180, 50, 50)", "rgb(223, 113, 53)", "rgb(249, 210, 55)", "rgb(150, 232, 67)", "rgb(103, 242, 237)", "rgb(88, 101, 240)", "rgb(187, 107, 241)"] // Color palette
let lives = 25; 
let paddleHit = false
let acceleration = 1
let accelerationFactor = 0.05
let wtfFactor = 5 // Paddle size rotation difference
let paddleSpeed = 4
let paddleSpeedIncrease = 4
let angle = Math.PI  // Starting rotation, normal
let FirstDifficultyIncrease = 20
let SecondDifficultyIncrease = 10
let rotation = false
// Second paddle definitions
let SecondupPressed = false;  // check for user input w
let SecondrightPressed = false;  // check for user input d
let SecondleftPressed = false;  // check for user input a
let SeconddownPressed = false;  // check for user input s
let SecondpaddleX = (canvas.width - paddleWidth) / 4;
let SecondpaddleY = canvas.height - paddleHeight - 40;
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
ballColor = "white"
let score = 0;

let bricks = [];
function createBricks () {
  // Creates a matrix of bricks with position in x and y and status for being hit
    for (let c = 0; c < brickColumnCount; c++) {  // Loops thrugh the bricks matrix and creates the bricks
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };  // Status represents being hit as 0
    }
    }
}

function drawBricks() {
  // For each brick in matrix a brick is drawn at their position*.
    for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        if (bricks[c][r].status === 1) {
          let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
          const brickY = r * (brickHeight) + brickOffsetTop + r;
          // Checks if brick column is in pairs of two and offset the x value to allow 2 columns to be placed together.
          if (c == 1 || c == 3 || c == 5 || c == 7 || c == 9 || c == 11 || c == 13 || c == 15 || c == 17 || c == 19 || c == 21) {
            brickX -= 4
          }
          bricks[c][r].x = brickX;
          bricks[c][r].y = brickY;
          ctx.beginPath();
          ctx.rect(brickX, brickY, brickWidth, brickHeight);
          ctx.fillStyle = colors[r];
          ctx.fill();
          ctx.closePath();
        }
      }
    }
  }  

function brickCollisionDetection() {
  // Checks for all bricks if the ball is in contact with them
    for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        const b = bricks[c][r];
        if (b.status === 1) {
          if ( // Checks if the ball is withing one of the bricks
            x + ballRadius > b.x &&
            x < b.x + brickWidth + ballRadius &&
            y + ballRadius > b.y &&
            y < b.y + brickHeight + ballRadius 
          ) { // Everyting below happens if collision is detected.
            // Changes size of paddle
            if (paddleWidth > 10) {
                paddleHeight += wtfFactor
                paddleWidth -= wtfFactor
                }
            // Allows paddle to hit ball again.
            paddleHit = false
            ballColor = "white"
            acceleration += accelerationFactor // Accelerates the ball and paddle.
            // Velocity change.
            if (x > b.x && x < b.x + brickWidth) {
                dy = -dy
            } else if (y > b.y && y < b.y + brickHeight) {
                dx = -dx
            } else {
                dy = -dy
                dx = -dx
            }
            b.status = 0; // Deletes the brick
            score++; // Add score
            // Checks for victory
            if (score === brickRowCount * brickColumnCount) {
              alert("YOU WIN, CONGRATULATIONS!");
              document.location.reload();
              clearInterval(interval); // Needed for Chrome to end game
            }
            break // Breaks the loop so the ball can only hit 1 ball per game tick.
          }
        }
      }
    }
}

function drawScore() {
    // Draws the score
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText(`Score: ${score}`, 8, 20);
}

function drawLives() {
  // Draws the Lives
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText(`Lives: ${lives}`, canvas.width - 65, 20);
}

function drawBall() {
  // Draws the Ball
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = ballColor;
    ctx.fill();
    ctx.closePath();
}

function drawPaddle(xPosition, yPosition, color) {
  // Draws the Paddle
    ctx.beginPath();
    ctx.save(); // Saves current state of canvas
    ctx.translate(xPosition + paddleWidth / 2, yPosition + paddleHeight / 2); // Changes the cordinates field to the paddles center
    ctx.rotate(angle); // Rotates the canvas
    ctx.translate(-(xPosition + paddleWidth / 2), -(yPosition + paddleHeight / 2)); // Changes the cordinates field back to upper left
    ctx.roundRect(xPosition, yPosition, paddleWidth, paddleHeight, 7);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
    ctx.restore(); // Restore previous canvas, removes rotation
}

function draw() {
  // Main function for handling all other events.
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Removes previous drawings/Canvas states.
    if (rotation) {
        angle += 0.05 // Rotation speed of paddle.
    }
    drawBricks(); // Draws the bricks
    drawBall(); // Draws the ball
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) { // Checks for collision with right and left wall
        acceleration += accelerationFactor
        paddleHit = false
        ballColor = "white"
        dx = -dx; // Velocity change in x axis 
      }
    if (y + dy < ballRadius) { // Checks for collision with roof
        acceleration += accelerationFactor
        paddleHit = false
        ballColor = "white"
        dy = -dy; // Velocity change in y axis 
    } 
    if (y + dy > canvas.height - ballRadius) {  // Checks for collision with floor
        acceleration = 1 // resets acceleration
        brickOffsetTop += brickOffsetTopAdder // Shrinks the canvas
        if (paddleWidth > 40) {
        paddleWidth -= 5  // Shrinks the paddle
        }
        accelerationFactor += 0.001  // More acceleration
        lives--; // subtracts 1 life
        if (lives == FirstDifficultyIncrease) { // First difficulty increase
            canvas.width = 720 // 50% increase in width.
            brickColumnCount += 8 // More bricks for wider canvas
            createBricks() // Redraws the bricks
            paddleSpeed += paddleSpeedIncrease // Increase paddle speed for wider canvas
            // Resets the paddle positions
            paddleX = (canvas.width - paddleWidth) * 3 / 4;
            SecondpaddleX = (canvas.width - paddleWidth) / 4;
        }
        if (lives == SecondDifficultyIncrease) { // Second difficulty increase
            rotation = true // Allows rotation of paddle
        }
        if (!lives) {  // checks if lives remain
        alert("GAME OVER");  // Game Over
        document.location.reload();
        clearInterval(interval); // Needed for Chrome to end game
        } else {  // Starts the next life
        x = canvas.width / 2;
        y = canvas.height - 50;
        dx = 2; 
        dy = -2;
        }
    }
    if ( // Check if ball is in collision with any GameBar
           (pointInRotatedRect(paddleX, paddleY) && paddleHit === false) ||
           (pointInRotatedRect(SecondpaddleX, SecondpaddleY) && paddleHit === false)
    
    ) { // Gives new x velocity based on which paddle is hit
        if (pointInRotatedRect(paddleX, paddleY)) { // Checks if first paddle is hit
            dx = findx(paddleX) // Gives new x velocity based on if first paddle is hit
        } else {
            dx = findx(SecondpaddleX) // Gives new x velocity based on if second paddle is hit
        }
        if (dx > 0) {
            dy = -(4 - dx) // Changes y velocity based on x velocity. Max 4 in total velocity allowed.
        } else {
            dy = -(4 + dx) // Changes y velocity based on x velocity. Max 4 in total velocity allowed.
        }
        // Dissallows more paddle collision until other collision is detected
        paddleHit = true
        ballColor = "red"
    }
    x += dx * acceleration; // New x position for ball
    y += dy * acceleration; // New y position for ball
    // Movement for first paddle
    if (rightPressed) { // Check for user input right arrow
        paddleX = Math.min(paddleX + paddleSpeed * acceleration, canvas.width - paddleWidth); // Moves GameBar right
      } else if (leftPressed) { // Check for user input left arrow
        paddleX = Math.max(paddleX - paddleSpeed * acceleration, 0); // Moves GameBar left
      }
    if (downPressed) { // Check for user input right arrow
        paddleY = Math.min(paddleY + 4 * acceleration, canvas.height - paddleHeight); // Moves GameBar right
      } else if (upPressed) { // Check for user input left arrow
        paddleY = Math.max(paddleY - 4 * acceleration, 0); // Moves GameBar left
      }
    // Movement for second paddle
    if (SecondrightPressed) { // Check for user input right arrow
        SecondpaddleX = Math.min(SecondpaddleX + paddleSpeed * acceleration, canvas.width - paddleWidth); // Moves GameBar right
      } else if (SecondleftPressed) { // Check for user input left arrow
        SecondpaddleX = Math.max(SecondpaddleX - paddleSpeed * acceleration, 0); // Moves GameBar left
      }
    if (SeconddownPressed) { // Check for user input right arrow
        SecondpaddleY = Math.min(SecondpaddleY + 4 * acceleration, canvas.height - paddleHeight); // Moves GameBar right
      } else if (SecondupPressed) { // Check for user input left arrow
        SecondpaddleY = Math.max(SecondpaddleY - 4 * acceleration, 0); // Moves GameBar left
      }
    brickCollisionDetection(); // checks for brick collision
    drawScore(); // Draws the score
    drawLives(); // Draws the lives
    drawPaddle(paddleX, paddleY, "rgb(232, 125, 143"); // Draws the first paddle
    drawPaddle(SecondpaddleX, SecondpaddleY, "Yellow"); // Draws the second paddle
}

function keyDownHandler(e) {
    // Input for first paddle
    if (e.key === "Right" || e.key === "ArrowRight") {  // Checks if RightArrow is pressed
      rightPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {  // Checks if LeftArrow is pressed
      leftPressed = true;
    } else if (e.key === "Down" || e.key === "ArrowDown") {  // Checks if LeftArrow is pressed
      downPressed = true;
    } else if (e.key === "Up" || e.key === "ArrowUp") {  // Checks if LeftArrow is pressed
      upPressed = true;
    }
    // Input for second paddle
    if (e.key === "d" || e.key === "d") {  // Checks if RightArrow is pressed
        SecondrightPressed = true;
    } else if (e.key === "a" || e.key === "a") {  // Checks if LeftArrow is pressed
        SecondleftPressed = true;
    } else if (e.key === "s" || e.key === "s") {  // Checks if LeftArrow is pressed
        SeconddownPressed = true;
    } else if (e.key === "w" || e.key === "w") {  // Checks if LeftArrow is pressed
        SecondupPressed = true;
    }
}
  
function keyUpHandler(e) {
  // Checks for no input for first paddle
    if (e.key === "Right" || e.key === "ArrowRight") { // Checks if RightArrow is no longer pressed
      rightPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft") { // Checks if LeftArrow is no longer pressed
      leftPressed = false;
    } else if (e.key === "Down" || e.key === "ArrowDown") {  // Checks if LeftArrow is pressed
      downPressed = false;
    } else if (e.key === "Up" || e.key === "ArrowUp") {  // Checks if LeftArrow is pressed
      upPressed = false;
    }
    // Checks for no input for second paddle
    if (e.key === "d" || e.key === "d") {  // Checks if RightArrow is pressed
        SecondrightPressed = false;
    } else if (e.key === "a" || e.key === "a") {  // Checks if LeftArrow is pressed
        SecondleftPressed = false;
    } else if (e.key === "s" || e.key === "s") {  // Checks if LeftArrow is pressed
        SeconddownPressed = false;
    } else if (e.key === "w" || e.key === "w") {  // Checks if LeftArrow is pressed
        SecondupPressed = false;
    }
}

function findx(xPoint) {
  // Gives new x velocity based on how far away from paddles center point.
    if (x - (xPoint + paddleWidth/2) > 0) { // Checks if ball is right of paddles center point.
        return 0.8 + (0.08 * (x - (xPoint + paddleWidth/2))) // f(x)=0.8 + 0.08(distance from center point)
    } else { // Negative due to hitting paddle left of paddle center point
        return -0.8 + (0.08 * (x - (xPoint + paddleWidth/2))) // f(x)=-0.8 + 0.08(distance from center point)
    }
}

function pointInRotatedRect(xPoint, YPoint) {
    // Calculate rectangle center from upper left corner
    const rectCenter = [
        xPoint + paddleWidth / 2,
        YPoint + paddleHeight / 2
    ];

    // Convert point to local space of the rotated rectangle
    const localPoint = [
        (x - rectCenter[0]) * Math.cos(-(angle)) - (y - rectCenter[1]) * Math.sin(-(angle)),
        (x - rectCenter[0]) * Math.sin(-(angle)) + (y - rectCenter[1]) * Math.cos(-(angle))
    ];

    // Calculate half width and half height of the rotated rectangle
    const halfWidth = paddleWidth / 2;
    const halfHeight = paddleHeight / 2;

    // Check if the point is within the boundaries of the rotated rectangle
    if (
        Math.abs(localPoint[0]) <= halfWidth &&
        Math.abs(localPoint[1]) <= halfHeight
    ) {
        return true;
    }

    return false;
}
createBricks() // Initially creates a bricks for the canvas
const interval = setInterval(draw, 10); // Interval for how often the main handler should redraw the canvas in miliseconds.
