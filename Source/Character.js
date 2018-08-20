class Character {
  constructor(name, torsoFileName, obj) {
    this.x = 300;
    this.y = 240;
    this.torso = new Actor(this.x, this.y, torsoFileName);
    this.name = name;
    this.scale = 1.0;
    this.loadFromDto(obj);
  }

  loadFromDto(obj) {
    // Special properties of a Class type with functions handled here.
    for (var prop in obj)
      if (prop != 'torso')
        this[prop] = obj[prop];

    for (var prop in obj)
      if (prop == 'torso')
        this.torso = new Actor(this.x, this.y, obj[prop].svgFile, obj[prop]);
  }

  loaded() {
    console.log('just loaded character: ' + this.name);
  }

  saving() {
    console.log('saving character: ' + this.name);
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

    //drawCrossHair(ctx, this.torso.anchorX, this.torso.anchorY, 10, "#f00", 'torso.anchorX, torso.anchorY');
  }
}