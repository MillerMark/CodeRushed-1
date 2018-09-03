var DesignSession = (function () {
    function DesignSession(obj) {
        this.characters = [];
        this.activeCharacter = null;
        this.activeCharacterIndex = null;
        this.loadFromDto(obj);
    }
    DesignSession.prototype.loadFromDto = function (obj) {
        for (var prop in obj)
            if (prop == 'characters' || prop == 'activeCharacter')
                this.loadCharacters(obj[prop]);
            else
                this[prop] = obj[prop];
    };
    DesignSession.prototype.loadCharacters = function (characters) {
        for (var i = 0; i < characters.length; i++) {
            var plainCharacter = characters[i];
            this.characters.push(new Character(plainCharacter.name, plainCharacter.torso.svgFile, plainCharacter));
        }
    };
    DesignSession.prototype.saving = function () {
        this.activeCharacterIndex = this.characters.indexOf(this.activeCharacter);
        this.characters.forEach(this.saving);
    };
    DesignSession.prototype.loaded = function () {
        this.characters.forEach(this.loadCharacter);
        if (!this.activeCharacterIndex)
            this.activeCharacterIndex = 0;
        if (this.characters.length > 0) {
            this.activeCharacter = this.characters[this.activeCharacterIndex];
            this.populateUserInterfaceBasedOnActiveCharacter();
        }
    };
    DesignSession.prototype.populateUserInterfaceBasedOnActiveCharacter = function () {
        var charNameTextBox = document.getElementById("txtCharacterName");
        charNameTextBox.value = this.activeCharacter.name;
    };
    DesignSession.prototype.loadCharacter = function (character) {
        character.loaded();
    };
    DesignSession.prototype.savingCharacter = function (character) {
        character.saving();
    };
    DesignSession.prototype.createAndActivateNewCharacter = function (charName, torsoFileName) {
        this.activeCharacter = new Character(charName, torsoFileName);
        this.characters.push(this.activeCharacter);
    };
    return DesignSession;
}());
//# sourceMappingURL=DesignSession.js.map