class DesignSession {
	constructor(obj) {
    this.characters = [];
    this.activeCharacter = null;
    this.loadFromDto(obj);
  }

  loadFromDto(obj) {
    for (var prop in obj)
      // Special properties of a Class type with functions handled here.
      if (prop == 'characters' || prop == 'activeCharacter')
        this.loadCharacters(obj[prop]);
      else
        this[prop] = obj[prop];
  }

  loadCharacters(characters) {
    characters.forEach(function (plainCharacter) {
      this.characters.push(new Character(plainCharacter.name, plainCharacter.torsoFileName, plainCharacter));
    }, this);
  }

  loaded() {
    this.characters.forEach(this.loadCharacter);
  }

  loadCharacter(character) {
    character.loaded();
  }

  createAndActivateNewCharacter(charName, torsoFileName) {
    this.activeCharacter = new Character(charName, torsoFileName);
    this.characters.push(designSession.activeCharacter);
  }
}