class Actor {
	constructor(x) {
    this.rectTop = 20;
    this.displacement = 0;
    this.x = x;
    this.initialVelocity = -15;
    this.startTime = new Date();
  }

  calculateNewPosition() {
    var now = new Date();
    var timeSpan = (now - this.startTime) / 1000;  // in seconds.
    this.displacement = Physics.getDisplacement(this.initialVelocity, timeSpan, gravity);
  }

  draw(ctx) {
    this.calculateNewPosition();
    ctx.fillRect(this.x, this.rectTop + this.displacement, rectWidth, rectHeight);
  }

  bounce(groundDistance) {
    var now = new Date();
    var timeSpan = (now - this.startTime) / 1000;  // in seconds.
    var currentVelocity = Physics.getFinalVelocity(this.initialVelocity, timeSpan, gravity);
    if (this.rectTop + this.displacement + rectHeight > groundDistance && currentVelocity > 0) {
      this.initialVelocity = -currentVelocity;
      this.startTime = new Date();
      this.rectTop += this.displacement;
      this.calculateNewPosition();
    }
  }
}

const rectWidth = 25;
const rectHeight = 25;
const gravity = 9.80665;