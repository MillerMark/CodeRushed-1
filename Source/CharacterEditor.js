var frameIndex = 0;
var folderName;
var baseFileName;
var frameCount;
var backgroundFrameImage;
var scale = 0.75;
var characterEditMode = characterEditModes.normal;

function loadBackgroundImageFromFiles() {
  folderName = document.getElementById("folderName").value;
  baseFileName = document.getElementById("baseFileName").value;
  frameCount = document.getElementById("frameCount").value;

  backgroundFrameImage = new Image();
  backgroundFrameImage.onload = function () {
    myCanvas.width = backgroundFrameImage.width * scale;
    myCanvas.height = backgroundFrameImage.height * scale;
    refresh();
  };
  frameIndex = 0;
  loadImage();
}

function loadImage() {
  if (backgroundFrameImage)
    backgroundFrameImage.src = folderName + '/' + baseFileName + frameIndex + '.png';
}

function refresh() {
  ctx.clearRect(0, 0, myCanvas.width, myCanvas.clientHeight);
  if (backgroundFrameImage)
    ctx.drawImage(backgroundFrameImage, 0, 0, backgroundFrameImage.width * scale, backgroundFrameImage.height * scale);
  designSession.activeCharacter.draw(ctx);
  drawCursor();
}

function drawCursor() {
  if (cursor)
    cursor.draw(ctx);
}

function frameNumberTextChanged() {
  setFrameIndex(frameIndexTextBox.value);
}

function setFrameIndex(newIndex) {
  if (frameIndex === newIndex) {
    return;
  }
  frameIndex = newIndex;
  frameIndexChanged();
}

function frameIndexChanged() {
  loadImage();
  updateFrameNumber();
  refresh();
}

function advanceFrameForward() {
  if (!frameCount || !backgroundFrameImage)
    return;
  if (!frameIndex || isNaN(frameIndex))
    frameIndex = 0;
  frameIndex++;
  if (frameIndex >= frameCount)
    frameIndex = 0;
  frameIndexChanged();
}

function advanceFrameBackward() {
  if (!frameCount || !backgroundFrameImage)
    return;
  if (!frameIndex || isNaN(frameIndex))
    frameIndex = 0;
  frameIndex--;
  if (frameIndex < 0)
    frameIndex = frameCount - 1;
  frameIndexChanged();
}

function updateFrameNumber() {
  frameIndexTextBox.value = frameIndex;
}

function getBackground(button) {
  if (button.children.length > 0)
    return button.children[0];
}

function getForeground(button) {
  if (button.children.length > 0)
    return button.children[button.children.length - 1];
}

function createNewLimb(e) {
  console.log("createNewLimb!");
}

function addCharacterToListBox(character) {
  var opt = document.createElement("option");
  var characterListBox = document.getElementById("lstKnownCharacters");
  if (!characterListBox)
    return;

  opt.text = character.name;
  opt.value = character;
  characterListBox.options.add(opt);
}

function createNewCharacter(e) {
  var charName = "(unnamed)";
  var torsoFileName = window.prompt("Torso File Name:", "ClydeFull.svg");
  if (torsoFileName === null || torsoFileName === "")
    return;

  // TODO: Check for duplicates and alert!!!

  designSession.createAndActivateNewCharacter(charName, torsoFileName);
  addCharacterToListBox(designSession.activeCharacter);
  
  refresh();
}

function createNewLayer(e) {
  console.log("createNewLayer!");
}

function characterNameChanged(e) {
  designSession.activeCharacter.name = document.getElementById('txtCharacterName').value;
  storage.save();
}

function characterScaleChanged(e) {
  designSession.activeCharacter.scale = document.getElementById('txtCharacterScale').value;
  refresh();
}

function updateCharacter() {
  refresh();
}

function scaleCharacterUp() {
  //e.preventDefault();
  designSession.activeCharacter.scale *= 1.1;
  refresh();
}

function scaleCharacterDown() {
  //e.preventDefault();
  if (designSession.activeCharacter.scale < 0)
    designSession.activeCharacter.scale = 1;
  designSession.activeCharacter.scale = designSession.activeCharacter.scale * 0.9;
  refresh();
}
 
function getMousePosInCanvas(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

function canvasMouseMove(e) {
  if (!cursor)
    return;
  var pos = getMousePosInCanvas(myCanvas, e);
  if (cursor) {
    cursor.x = pos.x;
    cursor.y = pos.y;
  }
}

function canvasMouseDown(e) {
  if (!cursor)
    return;

  cursor = null;
  characterEditMode = characterEditModes.spinTest;
  designSession.activeCharacter.torso.spinning = true;
  var pos = getMousePosInCanvas(myCanvas, e);
  console.log('(' + pos.x + ', ' + pos.y + ')');
  var upperLeftX = pos.x - (designSession.activeCharacter.x - designSession.activeCharacter.torso.anchorX);
  var upperLeftY = pos.y - (designSession.activeCharacter.y - designSession.activeCharacter.torso.anchorY);
  console.log('Upper Left: (' + upperLeftX + ', ' + upperLeftY + ')');
  designSession.activeCharacter.torso.anchorX = upperLeftX;
  designSession.activeCharacter.torso.anchorY = upperLeftY;
  refresh();
}

function dropAnchor() {
  characterEditMode = characterEditModes.setAnchor;
  designSession.activeCharacter.torso.spinning = false;
  designSession.activeCharacter.scale = 1;
  cursor = new Actor(0, 0, 'TargetPinpoint.svg');
  cursor.anchorY = 90;
  refresh();
}

function configureRepeatButtons() {
  var buttons = document.getElementsByClassName("repeatButton");
  for (var i = 0; i < buttons.length; i++) {
    var button = buttons[i];
    button.addEventListener("animationiteration", function (e) {
      var event = document.createEvent("MouseEvents");
      event.initEvent("click", true, true);
      event.synthetic = true;
      this.dispatchEvent(event, true);
    }, false);
  }
}

var cursor = null;
var frameIndexTextBox = document.getElementById("frameNumber");

// addSvgButton("btnNewCharacter", createNewCharacter);
// addSvgButton("btnNewLimb", createNewLimb);
// addSvgButton("btnNewLayer", createNewLayer);
// addSvgButton("btnBackFrame");
// addSvgButton("btnForwardFrame");
// addSvgButton("btnScaleUp", scaleCharacterUp);
// addSvgButton("btnScaleDown", scaleCharacterDown);

configureRepeatButtons();
var designSession = new DesignSession();
var myCanvas = document.getElementById("myCanvas");
var ctx = myCanvas.getContext("2d");

var storage = new LocalStorage();

// TODO: remove this line of code...
designSession.createAndActivateNewCharacter("clyde", "ClydeFull.svg");
designSession.activeCharacter.torso.spinning = true;

const clydeBodyCenterX = 236;
const clydeBodyCenterY = 150;
const clydeThighCenterX = 223;
const clydeThighCenterY = 275;
const clydeEyeCenterX = 380;
const clydeEyeCenterY = 150;
//character.torso.anchorX = clydeThighCenterX;
//character.torso.anchorY = clydeThighCenterY;

designSession.activeCharacter.torso.anchorX = clydeEyeCenterX;
designSession.activeCharacter.torso.anchorY = clydeEyeCenterY;
gravity = 0;
setInterval(updateCharacter, 10);
