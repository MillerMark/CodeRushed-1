var svgPath = "../SVGs/";
var Actor = (function () {
    function Actor(x, y, svgFile, killActorFunction, obj) {
        this.killActorFunc = killActorFunction;
        this.img = new Image();
        this.svgFile = svgFile;
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
        this.startTime = new Date().getTime();
        this.moveTime = new Date().getTime();
        this.stopped = false;
        this.spinning = false;
        this.scaleWidth = 1;
        this.scaleHeight = 1;
        this.loadFromDto(obj);
    }
    Actor.prototype.loadFromDto = function (obj) {
        for (var prop in obj)
            this[prop] = obj[prop];
    };
    Actor.prototype.calculateNewPosition = function () {
        if (this.stopped)
            return;
        var now = new Date().getTime();
        var timeSpan = (now - this.moveTime) / 1000;
        this.displacementX = Physics.metersToPixels(Physics.getDisplacement(this.currentVelocityX, timeSpan, 0));
        this.displacementY = Physics.metersToPixels(Physics.getDisplacement(this.currentVelocityY, timeSpan, gravity));
    };
    Actor.prototype.draw = function (ctx) {
        var now = new Date().getTime();
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
        DrawingTools.drawCrossHair(ctx, x, y, 10, "#00f", "anchor");
        ctx.restore();
    };
    Actor.prototype.stop = function (myCanvas) {
        this.currentVelocityX = 0;
        this.currentVelocityY = 0;
        this.x += this.displacementX;
        this.y += this.displacementY;
        this.displacementY = 0;
        this.displacementX = 0;
        this.y = myCanvas.clientHeight - rectHeight;
        this.stopped = true;
        this.stopTime = new Date().getTime();
    };
    Actor.prototype.goingImperceptablySlow = function () {
        return Math.abs(this.currentVelocityY) < 0.008;
    };
    Actor.prototype.headingTowardGravityCenter = function () {
        return this.currentVelocityY < 0;
    };
    Actor.prototype.headingAwayFromGravityCenter = function () {
        return this.currentVelocityY > 0;
    };
    Actor.prototype.bounce = function (left, right, floor, myCanvas) {
        if (this.stopped)
            return;
        var now = new Date().getTime();
        var timeSpan = (now - this.moveTime) / 1000;
        var currentVelocityY = Physics.getFinalVelocity(this.currentVelocityY, timeSpan, gravity) * 0.9;
        var rectBottom = this.y + rectHeight;
        var futureBottom = rectBottom + this.displacementY;
        if (this.x + this.displacementX > right) {
            this.stop(myCanvas);
            return;
        }
        if (futureBottom + 15 > floor && this.headingTowardGravityCenter() && this.goingImperceptablySlow()) {
            this.stop(myCanvas);
            return;
        }
        if (futureBottom > floor && currentVelocityY > 0) {
            this.calculateNewPosition();
            this.currentVelocityY = -currentVelocityY;
            this.x += this.displacementX;
            this.y += this.displacementY;
            this.moveTime = now;
        }
    };
    return Actor;
}());
var rectWidth = 25;
var rectHeight = 25;
var gravity = 9.80665;
//# sourceMappingURL=Actor.js.map