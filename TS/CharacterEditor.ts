class CharacterEditor {
  cursor: Actor;
  ctx: any;
  myCanvas: HTMLCanvasElement;
  designSession: DesignSession;
  backgroundFrameImage: HTMLImageElement;
  characterEditMode: number;
  scale: number;
  frameIndex: number;
  folderName: string;
  baseFileName: string;
  frameCount: string;

  constructor() {
    this.scale = 0.75;
    this.characterEditMode = characterEditModes.normal;
  }
  

  loadBackgroundImageFromFiles() {
    this.folderName = <string>(<HTMLInputElement>document.getElementById("folderName")).value;
    this.baseFileName = <string>(<HTMLInputElement>document.getElementById("baseFileName")).value;
    this.frameCount = <string>(<HTMLInputElement>document.getElementById("frameCount")).value;

    this.backgroundFrameImage = new Image();
    var self = this;
    this.backgroundFrameImage.onload = () => {
      this.myCanvas.width = this.backgroundFrameImage.width * this.scale;
      this.myCanvas.height = this.backgroundFrameImage.height * this.scale;
      this.refresh();
    };
    this.frameIndex = 0;
    this.loadImage();
  }

  loadImage() {
    if (backgroundFrameImage)
      backgroundFrameImage.src = folderName + '/' + baseFileName + frameIndex + '.png';
  }

  refresh() {
    ctx.clearRect(0, 0, myCanvas.width, myCanvas.clientHeight);
    if (backgroundFrameImage)
      ctx.drawImage(backgroundFrameImage, 0, 0, backgroundFrameImage.width * scale, backgroundFrameImage.height * scale);
    if (designSession.activeCharacter)
      designSession.activeCharacter.draw(ctx);
    drawCursor();
  }

  drawCursor() {
    if (cursor)
      cursor.draw(ctx);
  }

  frameNumberTextChanged() {
    setFrameIndex(frameIndexTextBox.value);
  }

  setFrameIndex(newIndex) {
    if (frameIndex === newIndex) {
      return;
    }
    frameIndex = newIndex;
    frameIndexChanged();
  }

  frameIndexChanged() {
    loadImage();
    updateFrameNumber();
    refresh();
  }

  advanceFrameForward() {
    if (!frameCount || !backgroundFrameImage)
      return;
    if (!frameIndex || isNaN(frameIndex))
      frameIndex = 0;
    frameIndex++;
    if (frameIndex >= frameCount)
      frameIndex = 0;
    frameIndexChanged();
  }

  advanceFrameBackward() {
    if (!frameCount || !backgroundFrameImage)
      return;
    if (!frameIndex || isNaN(frameIndex))
      frameIndex = 0;
    frameIndex--;
    if (frameIndex < 0)
      frameIndex = frameCount - 1;
    frameIndexChanged();
  }

  updateFrameNumber() {
    frameIndexTextBox.value = frameIndex;
  }

  getBackground(button) {
    if (button.children.length > 0)
      return button.children[0];
  }

  getForeground(button) {
    if (button.children.length > 0)
      return button.children[button.children.length - 1];
  }

  createNewLimb(e) {
    console.log("createNewLimb!");
  }

  addCharacterToListBox(character) {
    var opt = document.createElement("option");
    var characterListBox = document.getElementById("lstKnownCharacters");
    if (!characterListBox)
      return;

    opt.text = character.name;
    opt.value = character;
    characterListBox.options.add(opt);
  }


  deleteSelectedAnimation() {
    console.log('deleteSelectedAnimation');
    // TODO: Implement this!
  }

  deleteSelectedCharacter() {
    console.log('deleteSelectedCharacter');
    // TODO: Implement this!
  }

  deleteSelectedPart() {
    console.log('deleteSelectedPart');
    // TODO: Implement this!
  }

  createNewPart() {
    console.log('createNewPart()');
    // TODO: Implement this!
  }

  createNewAnimation() {
    console.log('createNewAnimation()');
    // TODO: Implement this!
  }

  createNewCharacter() {
    var charName = "(unnamed)";
    var torsoFileName = window.prompt("Torso File Name:", "ClydeFull.svg");
    if (torsoFileName === null || torsoFileName === "")
      return;

    // TODO: Check for duplicates and alert!!!

    this.designSession.createAndActivateNewCharacter(charName, torsoFileName);
    this.addCharacterToListBox(this.designSession.activeCharacter);

    this.refresh();
  }

  createNewLayer(e) {
    console.log("createNewLayer!");
  }

  characterNameChanged(e) {
    this.designSession.activeCharacter.name = document.getElementById('txtCharacterName').value;
    this.storage.save();
  }

  updateCharacter() {
    this.refresh();
  }

  //++ Scaling...
  scaleCharacterUp() {
    //e.preventDefault();
    this.designSession.activeCharacter.scale *= 1.1;
    this.refresh();
  }

  scaleCharacterDown() {
    //e.preventDefault();
    if (this.designSession.activeCharacter.scale < 0)
      this.designSession.activeCharacter.scale = 1;
    this.designSession.activeCharacter.scale = this.designSession.activeCharacter.scale * 0.9;
    this.refresh();
  }

  characterScaleChanged(e) {
    this.designSession.activeCharacter.scale = (<HTMLInputElement>document.getElementById('txtCharacterScale')).value;
    this.refresh();
  }

  //++ Mouse Event Handlers...
  getMousePosInCanvas(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }

  canvasMouseMove(e) {
    if (!this.cursor)
      return;
    var pos = this.getMousePosInCanvas(this.myCanvas, e);
    if (this.cursor) {
      this.cursor.x = pos.x;
      this.cursor.y = pos.y;
    }
  }

  canvasMouseDown(e) {
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
  }

  dropAnchor() {
    this.characterEditMode = characterEditModes.setAnchor;
    this.designSession.activeCharacter.torso.spinning = false;
    this.designSession.activeCharacter.scale = 1;
    this.cursor = new Actor(0, 0, 'TargetPinpoint.svg');
    this.cursor.anchorY = 90;
    this.refresh();
  }

  configureRepeatButtons() {
    var buttons = document.getElementsByClassName("repeatButton");
    for (var i = 0; i < buttons.length; i++) {
      var button = buttons[i];
      button.addEventListener("animationiteration", function (e) {
        var event = document.createEvent("MouseEvents");
        event.initEvent("click", true, true);
        //event.synthetic = true;
        this.dispatchEvent(event, true);
      }, false);
    }
  }

  main() {
    var cursor = null;
    var frameIndexTextBox = document.getElementById("frameNumber");

    // addSvgButton("btnNewCharacter", createNewCharacter);
    // addSvgButton("btnNewLimb", createNewLimb);
    // addSvgButton("btnNewLayer", createNewLayer);
    // addSvgButton("btnBackFrame");
    // addSvgButton("btnForwardFrame");
    // addSvgButton("btnScaleUp", scaleCharacterUp);
    // addSvgButton("btnScaleDown", scaleCharacterDown);

    this.configureRepeatButtons();
    this.designSession = new DesignSession();
    this.myCanvas = <HTMLCanvasElement>document.getElementById("myCanvas");
    this.ctx = this.myCanvas.getContext("2d");

    var storage = new LocalStorage();
    storage.load();

    // TODO: remove this line of code...
    //designSession.createAndActivateNewCharacter("clyde", "ClydeFull.svg");
    //designSession.activeCharacter.torso.spinning = true;

    const clydeBodyCenterX = 236;
    const clydeBodyCenterY = 150;
    const clydeThighCenterX = 223;
    const clydeThighCenterY = 275;
    const clydeEyeCenterX = 380;
    const clydeEyeCenterY = 150;
    //character.torso.anchorX = clydeThighCenterX;
    //character.torso.anchorY = clydeThighCenterY;

    //designSession.activeCharacter.torso.anchorX = clydeEyeCenterX;
    //designSession.activeCharacter.torso.anchorY = clydeEyeCenterY;

    gravity = 0;
    setInterval(this.updateCharacter, 10);
  }
}