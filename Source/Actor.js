const svgPath = "../SVGs/";

class Actor {
  constructor(x, y, svgFile, killActorFunction) {
    this.killActorFunction = killActorFunction;
    this.img = new Image();
    this.img.src = svgPath + svgFile;
    this.centerX = 0;
    this.centerY = 0;
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

    this.centerX = this.img.width / 2;
    this.centerY = this.img.height / 2;


    if (this.stopped) {
      ctx.globalAlpha = 0.5;
      
      var msStopped = now - this.stopTime;
      if (msStopped > 1000) {
        if (this.killActorFunction)
          this.killActorFunction(this);
        return;

      }
      this.opacity = (1000 - msStopped) / 1000;
    }
      
    this.calculateNewPosition();
    ctx.globalAlpha = this.opacity;
    //ctx.fillRect(this.x + this.displacementX, this.y + this.displacementY, rectWidth, rectHeight);

    var scale = 0.3;

    var secondsAlive = (now - this.startTime) / 1000;
    var degrees = secondsAlive * 90;
    var x = this.x + this.displacementX;
    var y = this.y + this.displacementY;

    var midX = x + scale * this.img.width / 2 - scale * this.centerX;
    var midY = y + scale * this.img.height / 2 - scale * this.centerY;

    ctx.save();
    

    ctx.translate(midX, midY);
    ctx.rotate(degrees * Math.PI / 180);
    ctx.translate(-midX, -midY);
    ctx.drawImage(this.img, x - scale * this.centerX, y - scale * this.centerY, this.img.width * scale, this.img.height * scale);
    //this.drawCrossHair(midX, midY, "#00f");

    ctx.restore();

    this.drawCrossHair(200, 200, "#f00");
  }

  drawCrossHair(x, y, color) {
    var crossHairHeight = 10;
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.moveTo(x, y - crossHairHeight);
    ctx.lineTo(x, y + crossHairHeight);
    ctx.moveTo(x - crossHairHeight, y);
    ctx.lineTo(x + crossHairHeight, y);
    ctx.stroke();
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