class Character {
	constructor(name, torsoFileName) {
    this.x = 200;
    this.y = 200;
    this.torso = new Actor(this.x, this.y, torsoFileName);
    this.name = name;
    this.scale = 1.0;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
//ctx.rotate(degrees * Math.PI / 180);
    ctx.scale(this.scale, this.scale);
    ctx.translate(-this.x, -this.y);
    
    this.torso.draw(ctx);
    //this.drawCrossHair(midX, midY, "#00f");

    ctx.restore();
  }
}