class Character {
	constructor(torsoFileName) {
    this.torso = new Actor(0, 0, torsoFileName);
  }

  draw(ctx) {
    this.torso.draw(ctx);
  }
}