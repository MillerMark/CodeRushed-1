function svgMouseOver(e) {
  var parentButton = e.currentTarget.parentButton;
  var background = getBackground(parentButton);
  background.style.fill = "#fcf5c4";
}

function mouseOut(e) {
  var parentButton = e.currentTarget.parentButton;
  var background = getBackground(parentButton);
  background.style.fill = "#fff";
}

function addSvgButton(buttonName, clickFunction) {
  var button = document.getElementById(buttonName);
  if (clickFunction)
    button.addEventListener("click", clickFunction);

  var topPolygon = getForeground(button);
  if (topPolygon) {

    topPolygon.addEventListener("mouseover", svgMouseOver);
    topPolygon.addEventListener("mouseout", mouseOut);
    topPolygon.parentButton = button;
  }
}