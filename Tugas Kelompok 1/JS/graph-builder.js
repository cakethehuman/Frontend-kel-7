// graph-builder.js

export class GraphBuilder {
  constructor(canvas, { scale = 30 } = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.width = canvas.width;
    this.height = canvas.height;
    this.originX = this.width / 2;
    this.originY = this.height / 2;
    this.scale = scale;
  }

  grid() {
    const { ctx, width, height, scale } = this;
    this.changeLineStroke("#ddd");
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

    return this;
  }

  axes() {
    const { ctx, width, height, originX, originY, scale } = this;

    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(0, originY);
    ctx.lineTo(width, originY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(originX, 0);
    ctx.lineTo(originX, height);
    ctx.stroke();

    ctx.fillStyle = "white";
    ctx.font = "14px Arial";

    for (let x = -10; x <= 10; x++) {
      if (x === 0) continue;
      const px = originX + x * scale;
      ctx.fillText(x, px - 5, originY + 20);
    }

    for (let y = -10; y <= 10; y++) {
      if (y === 0) continue;
      const py = originY - y * scale;
      ctx.fillText(y, originX + 8, py + 5);
    }

    return this;
  }

  point(x, y) {
    const { pixelX, pixelY } = this._toPixel(x, y);
    const { ctx } = this;

    ctx.beginPath();
    ctx.arc(pixelX, pixelY, 5, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();

    return this;
  }

  line(x1, y1, x2, y2) {
    const p1 = this._toPixel(x1, y1);
    const p2 = this._toPixel(x2, y2);

    this.changeLineStroke("yellow");
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(p1.pixelX, p1.pixelY);
    this.ctx.lineTo(p2.pixelX, p2.pixelY);
    this.ctx.stroke();

    return this;
  }

  changeLineStroke(color){
    this.ctx.strokeStyle = color;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    return this;
    }

  _toPixel(x, y) {
    return {
      pixelX: this.originX + x * this.scale,
      pixelY: this.originY - y * this.scale,
    };
  }
}