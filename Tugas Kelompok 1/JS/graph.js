const canvas = document.getElementById("cartesian-graph");

const ctx = canvas.getContext("2d");

const width = canvas.width;
const height = canvas.height;

const originX = width / 2;
const originY = height / 2;

const scale = 30;

ctx.strokeStyle = "#ddd";
ctx.lineWidth = 1;

for (let x = 0; x <= width; x += scale) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
}


for (let y = 0; y <= height; y += scale) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
}

ctx.strokeStyle = "black";
ctx.lineWidth = 2;

// X line
ctx.beginPath();
ctx.moveTo(0,originY);
ctx.lineTo(width, originY);
ctx.stroke();

// Y line
ctx.beginPath();
ctx.moveTo(originX,0);
ctx.lineTo(originX, height);
ctx.stroke();

ctx.fillStyle = "black";
ctx.font = "14px Arial";

for (let x = -10; x <= 10; x++) {
    if (x === 0) continue;

    const px = originX + x * scale;
    ctx.fillText(x, px - 5, originY + 20);
}

// Draw y-axis labels
for (let y = -10; y <= 10; y++) {
    if (y === 0) continue;

    const py = originY - y * scale;
    ctx.fillText(y, originX + 8, py + 5);
}


function plotPoint(x, y) {
    const pixelX = originX + x * scale;
    const pixelY = originY - y * scale;

    ctx.beginPath();
    ctx.arc(pixelX, pixelY, 5, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();
}

plotPoint(3, 2);