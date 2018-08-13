class DesignSession {
	constructor() {
    this.characters = [];
    this.activeCharacter = null;
  }

  createAndActivateNewCharacter(charName, torsoFileName) {
    this.activeCharacter = new Character(charName, torsoFileName);
    this.characters.push(designSession.activeCharacter);
  }
}