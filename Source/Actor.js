class Actor {
	constructor(x) {
    this.rectTop = 100;
    this.x = x;
    this.initialVelocity = -5;
    this.startTime = new Date();
  }

  draw(ctx) {
    var now = new Date();
    var timeSpan = (now - this.startTime) / 1000;  // in seconds.
    var displacement = Physics.getDisplacement(this.initialVelocity, timeSpan, gravity);
    this.rectTop += displacement;
    ctx.fillRect(this.x, this.rectTop, rectWidth, rectHeight);
  }


  bounce(groundDistance) {
    if (this.rectTop + rectHeight > groundDistance) {
      var now = new Date();
      var timeSpan = (now - this.startTime) / 1000;  // in seconds.
      this.initialVelocity = -Physics.getFinalVelocity(this.initialVelocity, timeSpan, gravity);
    }
  }
}

const rectWidth = 25;
const rectHeight = 100;
const gravity = 9.80665;