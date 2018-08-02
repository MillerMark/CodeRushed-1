class Actor {
  constructor(x, y, svgFile) {
    this.img = new Image();
    this.img.src = svgFile;
    this.y = y;
    this.displacementX = 0;
    this.displacementY = 0;
    this.x = x;
    this.opacity = 1;
    this.currentVelocityX = 2;
    this.currentVelocityY = -2;
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

    if (this.stopped) {
      ctx.globalAlpha = 0.5;
      
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
    //ctx.fillRect(this.x + this.displacementX, this.y + this.displacementY, rectWidth, rectHeight);

    var scale = 0.15;

    var secondsAlive = (now - this.startTime) / 1000;
    var degrees = secondsAlive * 90;
    var x = this.x + this.displacementX;
    var y = this.y + this.displacementY;

    var midX = x + scale * this.img.width / 2;
    var midY = y + scale * this.img.height / 2;

    ctx.save();
    //this.drawCrossHair(x, y, "#f00");

    ctx.translate(midX, midY);
    ctx.rotate(degrees * Math.PI / 180);
    ctx.translate(-midX, -midY);
    ctx.drawImage(this.img, x, y, this.img.width * scale, this.img.height * scale);
    //this.drawCrossHair(midX, midY, "#00f");

    ctx.restore();
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
const gravity = 9.80665;