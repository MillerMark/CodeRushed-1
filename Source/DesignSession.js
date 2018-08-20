class DesignSession {
	constructor(obj) {
    this.characters = [];
    this.activeCharacter = null;
    this.activeCharacterIndex = null;
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
    for (var i = 0; i < characters.length; i++) {
      var plainCharacter = characters[i];
      this.characters.push(new Character(plainCharacter.name, plainCharacter.torsoFileName, plainCharacter));
    }
  }

  saving() {
    this.activeCharacterIndex = this.characters.indexOf(this.activeCharacter);
    this.characters.forEach(this.saving);
  }

  loaded() {
    this.characters.forEach(this.loadCharacter);
    this.activeCharacter = this.characters[this.activeCharacterIndex];
  }

  loadCharacter(character) {
    character.loaded();
  }

  savingCharacter(character) {
    character.saving();
  }

  createAndActivateNewCharacter(charName, torsoFileName) {
    this.activeCharacter = new Character(charName, torsoFileName);
    this.characters.push(designSession.activeCharacter);
  }
}