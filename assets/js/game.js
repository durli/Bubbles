// var maxScore = localStorage.getItem("maxScore");
// console.log("maxScore = ", maxScore);

// if (maxScore == null) {
//     localStorage.setItem("maxScore", 0);
// }
var maxScore = 0;

fetchScore();   //fetching maxScore currently stored in the database. Calling function in home.ejs
console.log("maxScore = ", maxScore);

// const bubblePop1 = document.createElement('div');


// Canvas Setup
const canvas = document.querySelector('#canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 500;

let score = 0;
let gameFrame = 0;
ctx.font = '40px Lato';  //Setting up the font-size & font-family of the score board
let gameSpeed = 1;  // This is to adjust the speed of the game
let gameOver = false;   // denotes whether the game has finished yet or not

// Mouse interactivity
let canvasPosition = canvas.getBoundingClientRect();

const mouse = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    click: false
};

// Below will update the position of mouse
canvas.addEventListener('mousedown', function (event) {
    mouse.click = true;
    mouse.x = event.x - canvasPosition.left;
    mouse.y = event.y - canvasPosition.top;
});

canvas.addEventListener('mouseup', function () {
    mouse.click = false;
});

// Player
const playerLeft = new Image();
playerLeft.src = '/images/fish-swim-left.png'; // Image of the fish (player)

const playerRight = new Image();
playerRight.src = '/images/fish-swim-right.png';

class Player {
    constructor() {
        this.x = canvas.width;    //This is the default position of the player when the game starts
        this.y = canvas.height / 2;
        this.radius = 50;   // Radius of the player circle
        this.angle = 0;     // Default direction at which the player points when the game starts
        this.frameX = 0;
        this.frameY = 0;
        this.frame = 0;
        this.spriteWidth = 160; // Width of the 'fish' image
        this.spriteHeight = 105;    //Height of the 'fish' image
    }

    // Below function is used to update the position of the player whenever mouse is moved.
    update() {
        const dx = this.x - mouse.x;    //horizontal distance between player's current position and the new target posiition
        const dy = this.y - mouse.y;
        let theta = Math.atan2(dy, dx);
        this.angle = theta;

        if (mouse.x != this.x) {
            // this.x -= dx;    // We removed this line because we don't want the player(fish) to immediately reach the target position
            this.x -= dx / 30;
        }
        if (mouse.y != this.y) {
            this.y -= dy / 30;
        }

        if (gameFrame % 5 == 0) {   // After every 5 cycles, next image in the sprite sheet is shown. This appear as the enemy swimming animation.
            this.frame = (this.frame + 1) % 12;
            this.frameX = this.frame % 4;
            this.frameY = Math.floor(this.frame / 4);
        }
    }

    draw() {
        if (mouse.click) {  // Whenever 'mousedown' event occurs, a line (or thread) appears between cursor & player (fish).
            ctx.lineWidth = 0.2;
            ctx.beginPath();

            // Line will start from (this.x, this.x) to (mouse.x, mouse.y)
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
        }

        /*ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);   // In order to create a circle at (this.x, this.y) as center, we will create an arc from angle 0 rad to 2π
        ctx.fill();
        ctx.closePath();
        ctx.fillRect(this.x, this.y, this.radius, 10);*/

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle); // for making the fish image rotate

        if (this.x >= mouse.x) {    //It means you have to move to the left direction.
            ctx.drawImage(playerLeft, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, 0 - 60, 0 - 45, this.spriteWidth / 1.2, this.spriteHeight / 1.1);
        } else {    // It means you have to move to the right direction.
            ctx.drawImage(playerRight, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, 0 - 60, 0 - 45, this.spriteWidth / 1.2, this.spriteHeight / 1.1);
        }

        ctx.restore();  // It will restore to the previous state that ctx.save() has saved.
    }
};
const player = new Player();

// Bubbles
const bubblesArray = [];
const bubbleImage = new Image();
// bubbleImage.src = 'bubble.png';
bubbleImage.src = '/images/bubble_pop.png';

class Bubble {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 100;
        this.radius = 50;
        this.speed = Math.random() * 5 + 1;
        this.distance;  //Distance of bubble from the player.
        this.counted = false;
        this.sound = Math.random() <= 0.5 ? 'sound1' : 'sound2'; // Sound when the bubble pop
        this.frameX = 0;
        this.spriteWidth = 91;
        this.spriteHeight = 91;
        this.pop = false;
    }

    update() {
        this.y -= this.speed;
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        this.distance = Math.sqrt(dx * dx + dy * dy);
    }

    draw() {
        /*ctx.fillStyle = 'blue';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.stroke();*/

        // ctx.drawImage(bubbleImage, this.x - 65, this.y - 65, this.radius * 2.6, this.radius * 2.6);
        ctx.drawImage(bubbleImage, this.frameX * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x - 68, this.y - 68, this.spriteWidth * 1.5, this.spriteHeight * 1.5);
    }
}

// Creating two types of sounds (when the bubbles burst)
const bubblePop1 = document.createElement('audio');
bubblePop1.src = '/audio/Plop.ogg';
const bubblePop2 = document.createElement('audio');
bubblePop2.src = '/audio/bubbles-single1.wav';

function handleBubbles() {
    if (gameFrame % 50 == 0) {  // A new bubble will be created after every 50 frames.
        bubblesArray.push(new Bubble());
    }

    // update the position of every bubble
    for (let i = 0; i < bubblesArray.length; i++) {
        bubblesArray[i].update();
        bubblesArray[i].draw();
    }

    // Remove all those bubbles which have moved past the top of the frame.
    for (let i = 0; i < bubblesArray.length; i++) {
        if (bubblesArray[i].y < 0 - bubblesArray[i].radius * 2) {
            bubblesArray.splice(i, 1);
        }

        // Collision Detection: In case there is a collision, increase the score by 1.
        else if (bubblesArray[i].distance < bubblesArray[i].radius + player.radius) {
            /*console.log("Collision!!");
            if (bubblesArray[i].counted == false) { // Score is increased only when a collision with a unvisited bubble is collided
                if (bubblesArray[i].sound == 'sound1') {
                    bubblePop1.play();
                } else {
                    bubblePop2.play();
                }
                score++;
                bubblesArray[i].counted = true;
                bubblesArray.splice(i, 1);  // Remove the bubble after collision
            }*/
            popAndRemove(i);
        }
    }
}

function popAndRemove(i) {
    if (bubblesArray[i]) {
        if (!bubblesArray[i].counted) {
            score++;
            if (bubblesArray[i].sound == 'sound1') {
                bubblePop1.play();
            } else {
                bubblePop2.play();
            }
        }
        bubblesArray[i].counted = true;
        bubblesArray[i].frameX++;

        if (bubblesArray[i].frameX > 7) {
            bubblesArray[i].pop = true;
        }
        if (bubblesArray[i].pop) {
            bubblesArray.splice(i, 1);
        }
        requestAnimationFrame(popAndRemove);
    }

}

// Repeating Background
const background = new Image();
background.src = '/images/bg1.png';

const BG = {
    x1: 0,  // initial position of first background image
    x2: canvas.width,   // initial position of the next background image (here 1st background is same as the next bg)
    y: 0,
    width: canvas.width,    // width of the background image
    height: canvas.height
}

function handleBackground() {
    BG.x1 -= gameSpeed;    // keep moving the background from right-to-left
    if (BG.x1 <= 0 - BG.width) {
        BG.x1 = BG.width;
    }
    ctx.drawImage(background, BG.x1, BG.y, BG.width, BG.height);

    BG.x2 -= gameSpeed;    // keep moving the next background as well
    if (BG.x2 <= 0 - BG.width) {
        BG.x2 = BG.width;
    }
    ctx.drawImage(background, BG.x2, BG.y, BG.width, BG.height);
}

// Enemy
const enemyImage = new Image();
enemyImage.src = '/images/enemy1.png';

class Enemy {
    constructor() {
        this.x = canvas.width + 200;    //enemy will come from the right end of the screen
        this.y = Math.random() * (canvas.height - 150) + 90;
        this.radius = 60;
        this.speed = Math.random() * 2 + 2; // We want speed of enemy in range of [2, 4)
        this.frame = 0;
        this.frameX = 0;    // number of columns between origin and the frame (or image) that you want to crop-out
        this.frameY = 0;    // number of columns between origin and the frame (or image) that you want to crop-out
        this.spriteWidth = 418; // width of the frame (or image) that you want to crop-out from the sprite Sheet
        this.spriteHeight = 397; // height of the frame (or image) that you want to crop-out from sprite sheet
    }
    draw() {
        /*ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);   // Drawing a circle with center at (this.x, this.y)
        ctx.fill();*/

        ctx.drawImage(enemyImage, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x - 60, this.y - 70, this.spriteWidth / 3, this.spriteHeight / 3);
    }

    update() {
        this.x -= this.speed;
        if (this.x < 0 - this.radius * 2) {   // In case the enemy has crossed the left end of the canvas
            this.x = canvas.width + 200;
            this.y = Math.random() * (canvas.height - 150) + 90;    // Change the y-position of the enemy for the next iteration
            this.speed = Math.random() * 2 + 2; // Also change the speed of the enemy.
        }

        if (gameFrame % 5 == 0) {   // After every 5 cycles, next image in the sprite sheet is shown. This appear as the enemy swimming animation.
            this.frame = (this.frame + 1) % 12;
            this.frameX = this.frame % 4;
            this.frameY = Math.floor(this.frame / 4);
        }

        // collision with enemy
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < this.radius + player.radius) {
            handleGameOver();
        }
    }
};

const enemy1 = new Enemy();

function handleEnemy() {
    enemy1.draw();
    enemy1.update();
}

const gameEndMusic = document.createElement('audio');
gameEndMusic.src = '/audio/game_end.wav';

function handleGameOver() {
    // maxScore = localStorage.getItem("maxScore");

    ctx.fillStyle = 'white';

    // Check if a new high score is made.
    if (score <= maxScore) {
        saveScore(score);
        ctx.fillText(`GAME OVER`, 260, 220);
        ctx.fillText(`Your Score: ${score}`, 260, 290);
    } else {
        saveScore(score);
        ctx.fillText(`GAME OVER`, 260, 220);
        ctx.fillStyle = 'orange';
        ctx.fillText(`New High Score: ${score}`, 260, 290);
    }


    if (score > maxScore) {
        localStorage.setItem("maxScore", score);
    }
    gameOver = true;
    gameEndMusic.play();
}

// Animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);   //This will erase the old drawing before drawing a new.
    handleBackground();
    player.update();
    player.draw();
    handleEnemy();
    // console.log(gameFrame);
    handleBubbles();
    ctx.fillStyle = 'white';
    ctx.fillText(`Score: ${score}`, 10, 50);
    ctx.fillStyle = '#f6c609';
    ctx.fillText(`High: ${maxScore}`, 640, 50);
    gameFrame++;
    if (!gameOver) {
        requestAnimationFrame(animate); //This will make the function call itself again & again (Recursion). This will create an animation
    }
}

animate();

// Whenever we resize the browser window, we need to calculate canvasPosition again.
window.addEventListener('resize', function () {
    let canvasPosition = canvas.getBoundingClientRect();
});

// Whenever restart button is clicked.
$('#restart').click(function () {
    window.location.reload();
});