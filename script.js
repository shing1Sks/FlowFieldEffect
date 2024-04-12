let canvas;
let ctx;
let flowFE;
let flowFEAnimation;
window.onload = function () {
  canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("root"));
  ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  flowFE = new FlowFieldEffect(ctx, canvas.width, canvas.height);
  flowFE.animate();
};

window.addEventListener("resize", function () {
  canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("root"));
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  flowFE = new FlowFieldEffect(ctx, canvas.width, canvas.height);
  this.cancelAnimationFrame(flowFEAnimation);
  flowFE.animate();
});

const mouse = {
  x: 0,
  y: 0,
};
window.addEventListener("mousemove", function (e) {
  mouse.x = e.x;
  mouse.y = e.y;
});
class FlowFieldEffect {
  #ctx;
  #width;
  #height;
  constructor(ctx, width, height) {
    this.#ctx = ctx;
    this.#ctx.lineWidth = 1;
    this.#width = width;
    this.#height = height;
    this.#ctx.strokeStyle = "white";
    this.x = 1;
    this.y = 1;
    this.angle = 0;
    this.lastTime = 0;
    this.interval = 1000 / 60;
    this.timer = 0;
    this.cellSize = 10;
    this.gradient;
    this.#drawGradient();
    this.#ctx.strokeStyle = this.gradient;
    this.radius = 0;
    this.vr = 0.03;
    this.length;
  }
  #drawLine(angle, x, y) {
    let positionX = x;
    let positionY = y;
    let dx = mouse.x - positionX;
    let dy = mouse.y - positionY;
    let dis = (dx * dx + dy * dy);
    if(dis>=300000) dis = 300000;
    this.#ctx.beginPath();
    this.#ctx.moveTo(x, y);
    this.length = dis/8000 + 6;
    this.#ctx.lineTo(x + Math.cos(angle) * this.length, y + Math.sin(angle) * this.length);
    this.#ctx.stroke();
  }
  #drawGradient() {
    this.gradient = this.#ctx.createLinearGradient(
      0,
      0,
      this.#width,
      this.#height
    );
    this.gradient.addColorStop(
      0.1,
      `hsl(${Math.random() * 360},100%,50%)`
    );
    this.gradient.addColorStop(
      0.3,
      `hsl(${Math.random() * 360},100%,50%)`
    );
    this.gradient.addColorStop(
      0.5,
      `hsl(${Math.random() * 360},100%,50%)`
    );
    this.gradient.addColorStop(
      0.7,
      `hsl(${Math.random() * 360},100%,50%)`
    );
    this.gradient.addColorStop(
      0.9,
      `hsl(${Math.random() * 360},100%,50%)`
    );
  }
  animate(timeStamp = 0) {
    const deltaTime = timeStamp - this.lastTime;
    this.lastTime = timeStamp;
    if (this.timer > this.interval) {
      this.#ctx.clearRect(0, 0, this.#width, this.#height);
      this.radius = this.radius + this.vr;
      if(this.radius > 7 || this.radius < -7) this.vr *= -1;
      for (let y = 0; y < this.#height; y += this.cellSize) {
        for (let x = 0; x < this.#width; x += this.cellSize) {
          const angle = (Math.cos(x * 0.02) + Math.sin(y * 0.02)) * this.radius;
          this.#drawLine(angle, x, y);
        }
      }
      this.timer = 0;
    } else {
      this.timer = this.timer + deltaTime;
    }
    flowFEAnimation = requestAnimationFrame(this.animate.bind(this));
  }
}
