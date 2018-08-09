const svgPath = "../SVGs/";

class Actor {
  constructor(x, y, svgFile, killActorFunction) {
    this.killActorFunc = killActorFunction;
    this.img = new Image();
    this.img.src = svgPath + svgFile;
    this.anchorX = 0;
    this.anchorY = 0;
    this.y = y;
    this.displacementX = 0;
    this.displacementY = 0;
    this.x = x;
    this.opacity = 1;
    this.currentVelocityX = 0;
    this.currentVelocityY = 0;
    this.startTime = new Date();
    this.moveTime = new Date();
    this.stopped = false;
    this.spinning = false;
    this.scaleWidth = 1;
    this.scaleHeight = 1;
  }


  calculateNewPosition() {
    if (this.stopped)
      return;
    var now = new Date();
    var timeSpan = (now - this.moveTime) / 1000;  // in seconds.
    this.displacementX = Physics.metersToPixels(Physics.getDisplacement(this.currentVelocityX, timeSpan, 0));
    this.displacementY = Physics.metersToPixels(Physics.getDisplacement(this.currentVelocityY, timeSpan, gravity));
  }

  draw(ctx) {
    var now = new Date();

    if (this.stopped) {
      ctx.globalAlpha = 0.5;

      var msStopped = now - this.stopTime;
      if (msStopped > 1000) {
        if (this.killActorFunc)
          this.killActorFunc(this);
        return;

      }
      this.opacity = (1000 - msStopped) / 1000;
    }

    this.calculateNewPosition();
    ctx.globalAlpha = this.opacity;

    var secondsAlive = (now - this.startTime) / 1000;
    var degrees = 0;
    if (this.spinning) {
      degrees = secondsAlive * 90;
    }
    
    var x = this.x + this.displacementX;
    var y = this.y + this.displacementY;

    ctx.save();

    ctx.translate(x, y);
    ctx.rotate(degrees * Math.PI / 180);
    ctx.translate(-x, -y);
    ctx.drawImage(this.img, x - this.scaleWidth * this.anchorX, y - this.scaleHeight * this.anchorY, this.img.width * this.scaleWidth, this.img.height * this.scaleHeight);
    drawCrossHair(ctx, x, y, 10, "#00f", "anchor");

    ctx.restore();

  }

  stop() {
    this.currentVelocityX = 0;
    this.currentVelocityY = 0;
    this.x += this.displacementX;
    this.y += this.displacementY;
    this.displacementY = 0;
    this.displacementX = 0;
    this.y = myCanvas.clientHeight - rectHeight;
    this.stopped = true;
    this.stopTime = new Date();
  }

  goingImperceptablySlow() {
    return Math.abs(this.currentVelocityY) < 0.008;
  }

  headingTowardGravityCenter() {
    return this.currentVelocityY < 0;
  }

  headingAwayFromGravityCenter() {
    return this.currentVelocityY > 0;
  }

  bounce(left, right, floor) {
    if (this.stopped)
      return;
    var now = new Date();
    var timeSpan = (now - this.moveTime) / 1000;  // in seconds.
    var currentVelocityY = Physics.getFinalVelocity(this.currentVelocityY, timeSpan, gravity) * 0.9;

    var rectBottom = this.y + rectHeight;
    var futureBottom = rectBottom + this.displacementY;
    if (this.x + this.displacementX > right) {
      this.stop();
      return;
    }
    // TODO: Get this working horizontally.

    if (futureBottom + 15 > floor && this.headingTowardGravityCenter() && this.goingImperceptablySlow()) {
      this.stop();
      return;
    }

    if (futureBottom > floor && currentVelocityY > 0) {
      this.calculateNewPosition();
      this.currentVelocityY = -currentVelocityY;
      this.x += this.displacementX;
      this.y += this.displacementY;
      this.moveTime = now;
    }
  }
}

const rectWidth = 25;
const rectHeight = 25;
var gravity = 9.80665;