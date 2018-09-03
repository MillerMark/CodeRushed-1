class DesignSession {
  activeCharacterIndex: any;
  activeCharacter: any;
  characters: any[];

	constructor(obj?: any) {
    this.characters = [];
    this.activeCharacter = null;
    this.activeCharacterIndex = null;
    this.loadFromDto(obj);
  }

  loadFromDto(obj) {
    for (var prop in obj)
      // Special properties of a Class type with functions handled here.
      // TODO: This second expression check ("|| prop == 'activeCharacter'") feels wrong. Double check it!
      if (prop == 'characters' || prop == 'activeCharacter')
        this.loadCharacters(obj[prop]);
      else
        this[prop] = obj[prop];
  }

  loadCharacters(characters) {
    for (var i = 0; i < characters.length; i++) {
      var plainCharacter = characters[i];
      this.characters.push(new Character(plainCharacter.name, plainCharacter.torso.svgFile, plainCharacter));
    }
  }

  saving() {
    this.activeCharacterIndex = this.characters.indexOf(this.activeCharacter);
    this.characters.forEach(this.saving);
  }

  loaded() {
    this.characters.forEach(this.loadCharacter);
    if (!this.activeCharacterIndex)
      this.activeCharacterIndex = 0;
    if (this.characters.length > 0) {
      this.activeCharacter = this.characters[this.activeCharacterIndex];
      this.populateUserInterfaceBasedOnActiveCharacter();
    }
  }

  populateUserInterfaceBasedOnActiveCharacter() {
    var charNameTextBox = <HTMLInputElement>document.getElementById("txtCharacterName");
    charNameTextBox.value = this.activeCharacter.name;
  }

  loadCharacter(character) {
    character.loaded();
  }

  savingCharacter(character) {
    character.saving();
  }

  createAndActivateNewCharacter(charName, torsoFileName) {
    this.activeCharacter = new Character(charName, torsoFileName);
    this.characters.push(this.activeCharacter);
  }
}