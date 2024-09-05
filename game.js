const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const crosshair = document.getElementById('crosshair');

let canvasWidth = window.innerWidth;
let canvasHeight = window.innerHeight;
canvas.width = canvasWidth;
canvas.height = canvasHeight;

const targets = [];
const targetSize = 30;
const hitSize = 20; 
const crosshairSize = 20;
const targetCount = 5;
const hits = [];
const misses = [];

const sensitivity = 1.0;

const holeImage = new Image();
holeImage.src = 'hole-image.png'; 

holeImage.onload = function() {
    setInterval(drawTargets, 1000 / 60);
};

function drawTargets() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    targets.forEach(target => {
        ctx.beginPath();
        ctx.arc(target.x, target.y, targetSize, 0, Math.PI * 2);
        ctx.fillStyle = 'red';
        ctx.fill();
    });

    hits.forEach(hit => {
        const holeDiameter = hitSize * 2; 
        ctx.drawImage(holeImage, hit.x - hitSize, hit.y - hitSize, holeDiameter, holeDiameter);
    });

    misses.forEach(miss => {
        const holeDiameter = hitSize * 2; 
        ctx.drawImage(holeImage, miss.x - hitSize, miss.y - hitSize, holeDiameter, holeDiameter);
    });
}

function createTargets() {
    targets.length = 0;
    for (let i = 0; i < targetCount; i++) {
        const x = Math.random() * (canvasWidth - 2 * targetSize) + targetSize;
        const y = Math.random() * (canvasHeight - 2 * targetSize) + targetSize;
        targets.push({ x, y });
    }
}


function updateCrosshairPosition(e) {
    const x = e.clientX * sensitivity;
    const y = e.clientY * sensitivity;
    
    crosshair.style.left = `${x - crosshairSize / 2}px`;
    crosshair.style.top = `${y - crosshairSize / 2}px`;
}

function checkHit(e) {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    let hit = false;
    
    targets.forEach(target => {
        const dx = mouseX - target.x;
        const dy = mouseY - target.y;
        if (Math.sqrt(dx * dx + dy * dy) < targetSize) {
            hit = true;
        }
    });

    (hit ? hits : misses).push({ x: mouseX, y: mouseY });
}

window.addEventListener('resize', () => {
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    createTargets();
});

canvas.addEventListener('mousemove', updateCrosshairPosition);
canvas.addEventListener('click', checkHit);

canvas.addEventListener('mouseenter', () => {
    crosshair.style.display = 'block'; 
});

canvas.addEventListener('mouseleave', () => {
    crosshair.style.display = 'none'; 
});

createTargets();
