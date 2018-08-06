class Character {
	constructor(name, torsoFileName) {
    this.torso = new Actor(0, 0, torsoFileName);
    this.name = name;
  }

  draw(ctx) {
    this.torso.draw(ctx);
  }
}