class Actor {
	constructor(x) {
    this.rectTop = myCanvas.clientHeight - Physics.convertToPixels(2) - rectHeight;
    this.displacement = 0;
    this.x = x;
    this.opacity = 1;
    this.currentVelocity = 0;
    this.startTime = new Date();
    this.stopped = false;
  }

  calculateNewPosition() {
    if (this.stopped)
      return;
    var now = new Date();
    var timeSpan = (now - this.startTime) / 1000;  // in seconds.
    this.displacement = Physics.convertToPixels(
      Physics.getDisplacement(this.currentVelocity, timeSpan, gravity)
    );
  }

  draw(ctx) {
    if (this.stopped) {
      ctx.globalAlpha = 0.5;
      var now = new Date();
      var msStopped = now - this.stopTime;
      if (msStopped > 1000) {

        // Hack - this low-level object shouldn't have to know about it's higher level container. Need to fix it.
        var index = actors.indexOf(this);
        if (index !== -1)
          actors.splice(index, 1);
        return;

      }
      this.opacity = (1000 - msStopped) / 1000;
    }
      
    this.calculateNewPosition();
    ctx.globalAlpha = this.opacity;
    ctx.fillRect(this.x, this.rectTop + this.displacement, rectWidth, rectHeight);
  }

  stop() {
    this.currentVelocity = 0;
    this.displacement = 0;
    this.rectTop = myCanvas.clientHeight - rectHeight;
    this.stopped = true;
    this.stopTime = new Date();
  }

  bounce(groundDistance) {
    if (this.stopped)
      return;
    var now = new Date();
    var timeSpan = (now - this.startTime) / 1000;  // in seconds.
    var currentVelocity = Physics.getFinalVelocity(this.currentVelocity, timeSpan, gravity) * 0.9;  // Hack! Fix this!

    if (currentVelocity < 0 && Math.abs(currentVelocity) < 0.0005) {
      this.stop();
      return;
    }

    if (this.rectTop + this.displacement + rectHeight > groundDistance && currentVelocity > 0) {
      this.currentVelocity = -currentVelocity;
      this.startTime = now;
      this.rectTop += this.displacement;
      this.calculateNewPosition();
    }
  }
}

const rectWidth = 25;
const rectHeight = 25;
const gravity = 9.80665;