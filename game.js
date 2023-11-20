const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let car = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: 50,
    height: 100,
    speed: 5
};

let obstacles = [];
let gameSpeed = 2;
let gameOver = false;
let startTime = Date.now();
let elapsedTime = 0;

let keys = {
    ArrowLeft: false,
    ArrowRight: false,
    ArrowUp: false,
    ArrowDown: false
};

document.addEventListener('keydown', function(e) {
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
        keys[e.key] = true;
    }
});

document.addEventListener('keyup', function(e) {
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
        keys[e.key] = false;
    }
});

function addObstacle() {
    let size = getRandomInt(50, 200);
    let position = getRandomInt(0, canvas.width - size);
    let obstacle = {
        x: position,
        y: 0,
        width: size,
        height: 20,
        type: Math.random() > 0.5 ? 'car' : 'tree'
    };
    obstacles.push(obstacle);
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function update() {
    if (keys.ArrowLeft && car.x > 0) {
        car.x -= car.speed;
    }
    if (keys.ArrowRight && car.x < canvas.width - car.width) {
        car.x += car.speed;
    }
    if (keys.ArrowUp && car.y > 0) {
        car.y -= car.speed;
    }
    if (keys.ArrowDown && car.y < canvas.height - car.height) {
        car.y += car.speed;
    }

    if (Math.random() < 0.02) {
        addObstacle();
    }

    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].y += gameSpeed;
        if (collision(car, obstacles[i])) {
            gameOver = true;
        }
    }

    obstacles = obstacles.filter(obstacle => obstacle.y < canvas.height);

    elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);
}

function collision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.height + rect1.y > rect2.y;
}

function drawCar(x, y, width, height) {
    ctx.fillStyle = 'blue';
    ctx.fillRect(x, y, width, height);
    // 这里可以添加更复杂的绘制逻辑来美化赛车
}

function drawObstacle(obstacle) {
    if (obstacle.type === 'car') {
        ctx.fillStyle = 'red';
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        // 这里可以添加更复杂的绘制逻辑来绘制其他汽车
    } else {
        ctx.fillStyle = 'green';
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        // 这里可以添加更复杂的绘制逻辑来绘制树木
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#808080'; // 灰色背景代表公路
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawCar(car.x, car.y, car.width, car.height);

    for (let obstacle of obstacles) {
        drawObstacle(obstacle);
    }

    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Time: " + elapsedTime + "s", 10, 30);

    if (gameOver) {
        ctx.fillStyle = "black";
        ctx.font = "40px Arial";
        ctx.fillText("Game Over", canvas.width / 2 - 100, canvas.height / 2);
    }
}

function gameLoop() {
    if (!gameOver) {
        update();
        draw();
        requestAnimationFrame(gameLoop);
    }
}

gameLoop();


