// Mouse
// Keyboard
// Scroll
// Clipboard
// Input & Form

const colorButton = document.querySelector('#colorButton');

function changeButtonColor(evt) {
  evt.target.style.backgroundColor = `rgb(${Math.floor(Math.random() * 256)})`;
}

colorButton.addEventListener('click', changeButtonColor);

let timesClicked = 0;
function changeButtonText(evt) {
  timesClicked++;
  evt.target.innerHTML = `Clicked ${timesClicked} time(s)`;
}

colorButton.addEventListener('click', changeButtonText);
colorButton.removeEventListener('click', changeButtonColor);
