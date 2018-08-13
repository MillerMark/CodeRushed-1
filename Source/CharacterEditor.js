var frameIndex = 0;
var folderName;
var baseFileName;
var frameCount;
var backgroundFrameImage;
var scale = 0.5;
var characterEditMode = characterEditModes.normal;

function Load() {
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
    character.draw(ctx);
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
    if (!frameIndex)
        frameIndex = 0;
    frameIndex++;
    if (frameIndex >= frameCount)
        frameIndex = 0;
    frameIndexChanged();
}

function advanceFrameBackward() {
    if (!frameIndex)
        frameIndex = 0;
    frameIndex--;
    if (frameIndex < 0)
        frameIndex = frameCount - 1;
    frameIndexChanged();
}

function updateFrameNumber() {
    frameIndexTextBox.value = frameIndex;
}

function hasClass(childElement, className) {
    for (var index = 0; index < childElement.classList.length; index++) {
        var thisClassName = childElement.classList[index];
        if (thisClassName === className)
            return true;
    }
    return false;
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

function createNewCharacter(e) {
    var charName = "(unnamed)";
    var torsoFileName = window.prompt("Torso File Name:", "ClydeFull.svg");
    if (torsoFileName === null || torsoFileName === "")
        return;

    character = new Character(charName, torsoFileName);
    refresh();
}

function createNewLayer(e) {
    console.log("createNewLayer!");
}

function characterNameChanged(e) {
    character.name = document.getElementById('txtCharacterName').value;
}

function characterScaleChanged(e) {
    character.scale = document.getElementById('txtCharacterScale').value;
    refresh();
}

function updateCharacter() {
    refresh();
}

function scaleCharacterUp() {
    //e.preventDefault();
    character.scale *= 1.1;
    refresh();
}

function scaleCharacterDown() {
    //e.preventDefault();
    if (character.scale < 0)
        character.scale = 1;
    character.scale = character.scale * 0.9;
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
    character.torso.spinning = true;
    var pos = getMousePosInCanvas(myCanvas, e);
    console.log('(' + pos.x + ', ' + pos.y + ')');
    var upperLeftX = pos.x - (character.x - character.torso.anchorX);
    var upperLeftY = pos.y - (character.y - character.torso.anchorY);
    console.log('Upper Left: (' + upperLeftX + ', ' + upperLeftY + ')');
    character.torso.anchorX = upperLeftX;
    character.torso.anchorY = upperLeftY;
    refresh();
}

function dropAnchor() {
    characterEditMode = characterEditModes.setAnchor;
    character.torso.spinning = false;
    character.scale = 1;
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
var myCanvas = document.getElementById("myCanvas");
var ctx = myCanvas.getContext("2d");
var character = new Character("clyde", "ClydeFull.svg");
character.torso.spinning = true;

const clydeBodyCenterX = 236;
const clydeBodyCenterY = 150;
const clydeThighCenterX = 223;
const clydeThighCenterY = 275;
const clydeEyeCenterX = 380;
const clydeEyeCenterY = 150;
//character.torso.anchorX = clydeThighCenterX;
//character.torso.anchorY = clydeThighCenterY;

character.torso.anchorX = clydeEyeCenterX;
character.torso.anchorY = clydeEyeCenterY;
gravity = 0;
setInterval(updateCharacter, 10);
