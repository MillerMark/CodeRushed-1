var CharacterEditor = (function () {
    function CharacterEditor() {
        this.scale = 0.75;
        this.characterEditMode = characterEditModes.normal;
        this.storage = new LocalStorage();
    }
    CharacterEditor.prototype.loadBackgroundImageFromFiles = function () {
        this.folderName = document.getElementById("folderName").value;
        this.baseFileName = document.getElementById("baseFileName").value;
        this.frameCount = +document.getElementById("frameCount").value;
        this.backgroundFrameImage = new Image();
        var self = this;
        this.backgroundFrameImage.onload = function () {
            self.myCanvas.width = self.backgroundFrameImage.width * self.scale;
            self.myCanvas.height = self.backgroundFrameImage.height * self.scale;
            self.refresh();
        };
        this.frameIndex = 0;
        this.loadImage();
    };
    CharacterEditor.prototype.loadImage = function () {
        if (this.backgroundFrameImage)
            this.backgroundFrameImage.src = this.folderName + '/' + this.baseFileName + this.frameIndex + '.png';
    };
    CharacterEditor.prototype.refresh = function () {
        this.ctx.clearRect(0, 0, this.myCanvas.width, this.myCanvas.clientHeight);
        if (this.backgroundFrameImage)
            this.ctx.drawImage(this.backgroundFrameImage, 0, 0, this.backgroundFrameImage.width * this.scale, this.backgroundFrameImage.height * this.scale);
        if (this.designSession.activeCharacter)
            this.designSession.activeCharacter.draw(this.ctx);
        this.drawCursor();
    };
    CharacterEditor.prototype.drawCursor = function () {
        if (this.cursor)
            this.cursor.draw(this.ctx);
    };
    CharacterEditor.prototype.frameNumberTextChanged = function () {
        this.setFrameIndex(this.frameIndexTextBox.value);
    };
    CharacterEditor.prototype.setFrameIndex = function (newIndex) {
        if (this.frameIndex === newIndex) {
            return;
        }
        this.frameIndex = newIndex;
        this.frameIndexChanged();
    };
    CharacterEditor.prototype.frameIndexChanged = function () {
        this.loadImage();
        this.updateFrameNumber();
        this.refresh();
    };
    CharacterEditor.prototype.advanceFrameForward = function () {
        if (!this.frameCount || !this.backgroundFrameImage)
            return;
        if (!this.frameIndex || isNaN(this.frameIndex))
            this.frameIndex = 0;
        this.frameIndex++;
        if (this.frameIndex >= this.frameCount)
            this.frameIndex = 0;
        this.frameIndexChanged();
    };
    CharacterEditor.prototype.advanceFrameBackward = function () {
        if (!this.frameCount || !this.backgroundFrameImage)
            return;
        if (!this.frameIndex || isNaN(this.frameIndex))
            this.frameIndex = 0;
        this.frameIndex--;
        if (this.frameIndex < 0)
            this.frameIndex = this.frameCount - 1;
        this.frameIndexChanged();
    };
    CharacterEditor.prototype.updateFrameNumber = function () {
        this.frameIndexTextBox.value = this.frameIndex.toString();
    };
    CharacterEditor.prototype.getBackground = function (button) {
        if (button.children.length > 0)
            return button.children[0];
    };
    CharacterEditor.prototype.getForeground = function (button) {
        if (button.children.length > 0)
            return button.children[button.children.length - 1];
    };
    CharacterEditor.prototype.createNewLimb = function (e) {
        console.log("createNewLimb!");
    };
    CharacterEditor.prototype.addCharacterToListBox = function (character) {
        var opt = document.createElement("option");
        var characterListBox = document.getElementById("lstKnownCharacters");
        if (!characterListBox)
            return;
        opt.text = character.name;
        opt.value = character;
        characterListBox.options.add(opt);
    };
    CharacterEditor.prototype.deleteSelectedAnimation = function () {
        console.log('deleteSelectedAnimation');
    };
    CharacterEditor.prototype.deleteSelectedCharacter = function () {
        console.log('deleteSelectedCharacter');
    };
    CharacterEditor.prototype.deleteSelectedPart = function () {
        console.log('deleteSelectedPart');
    };
    CharacterEditor.prototype.createNewPart = function () {
        console.log('createNewPart()');
    };
    CharacterEditor.prototype.createNewAnimation = function () {
        console.log('createNewAnimation()');
    };
    CharacterEditor.prototype.createNewCharacter = function () {
        var charName = "(unnamed)";
        var torsoFileName = window.prompt("Torso File Name:", "ClydeFull.svg");
        if (torsoFileName === null || torsoFileName === "")
            return;
        this.designSession.createAndActivateNewCharacter(charName, torsoFileName);
        this.addCharacterToListBox(this.designSession.activeCharacter);
        this.refresh();
    };
    CharacterEditor.prototype.createNewLayer = function (e) {
        console.log("createNewLayer!");
    };
    CharacterEditor.prototype.characterNameChanged = function (e) {
        this.designSession.activeCharacter.name = document.getElementById('txtCharacterName').value;
        this.storage.save(this.designSession);
    };
    CharacterEditor.prototype.scaleCharacterUp = function () {
        this.designSession.activeCharacter.scale *= 1.1;
        this.refresh();
    };
    CharacterEditor.prototype.scaleCharacterDown = function () {
        if (this.designSession.activeCharacter.scale < 0)
            this.designSession.activeCharacter.scale = 1;
        this.designSession.activeCharacter.scale = this.designSession.activeCharacter.scale * 0.9;
        this.refresh();
    };
    CharacterEditor.prototype.characterScaleChanged = function (e) {
        this.designSession.activeCharacter.scale = document.getElementById('txtCharacterScale').value;
        this.refresh();
    };
    CharacterEditor.prototype.getMousePosInCanvas = function (canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    };
    CharacterEditor.prototype.canvasMouseMove = function (e) {
        if (!this.cursor)
            return;
        var pos = this.getMousePosInCanvas(this.myCanvas, e);
        if (this.cursor) {
            this.cursor.x = pos.x;
            this.cursor.y = pos.y;
        }
    };
    CharacterEditor.prototype.canvasMouseDown = function (e) {
        if (!this.cursor)
            return;
        this.cursor = null;
        this.characterEditMode = characterEditModes.spinTest;
        this.designSession.activeCharacter.torso.spinning = true;
        var pos = this.getMousePosInCanvas(this.myCanvas, e);
        console.log('(' + pos.x + ', ' + pos.y + ')');
        var upperLeftX = pos.x - (this.designSession.activeCharacter.x - this.designSession.activeCharacter.torso.anchorX);
        var upperLeftY = pos.y - (this.designSession.activeCharacter.y - this.designSession.activeCharacter.torso.anchorY);
        console.log('Upper Left: (' + upperLeftX + ', ' + upperLeftY + ')');
        this.designSession.activeCharacter.torso.anchorX = upperLeftX;
        this.designSession.activeCharacter.torso.anchorY = upperLeftY;
        this.refresh();
    };
    CharacterEditor.prototype.dropAnchor = function () {
        this.characterEditMode = characterEditModes.setAnchor;
        this.designSession.activeCharacter.torso.spinning = false;
        this.designSession.activeCharacter.scale = 1;
        this.cursor = new Actor(0, 0, 'TargetPinpoint.svg');
        this.cursor.anchorY = 90;
        this.refresh();
    };
    CharacterEditor.prototype.configureRepeatButtons = function () {
        var buttons = document.getElementsByClassName("repeatButton");
        for (var i = 0; i < buttons.length; i++) {
            var button = buttons[i];
            button.addEventListener("animationiteration", function (e) {
                var event = document.createEvent("MouseEvents");
                event.initEvent("click", true, true);
                this.dispatchEvent(event, true);
            }, false);
        }
    };
    CharacterEditor.prototype.main = function () {
        this.cursor = null;
        this.frameIndexTextBox = document.getElementById("frameNumber");
        this.configureRepeatButtons();
        this.designSession = new DesignSession();
        this.myCanvas = document.getElementById("myCanvas");
        this.ctx = this.myCanvas.getContext("2d");
        this.storage = new LocalStorage();
        this.designSession = this.storage.load();
        this.refresh();
        var clydeBodyCenterX = 236;
        var clydeBodyCenterY = 150;
        var clydeThighCenterX = 223;
        var clydeThighCenterY = 275;
        var clydeEyeCenterX = 380;
        var clydeEyeCenterY = 150;
        gravity = 0;
    };
    return CharacterEditor;
}());
//# sourceMappingURL=CharacterEditor.js.map