const BG_COLOUR = '#231f20';
const SNAKE_COLOUR = '#c2c2c2';
const FOOD_COLOUR = '#e66916';

const SPRITE_SIZE = 32;
const SPRITE = new Image();

const socket = io('https://retr-ws.herokuapp.com/');

socket.on('init', handleInit);
socket.on('gameState', handleGameState);
socket.on('gameOver', handleGameOver);
socket.on('gameCode', handleGameCode);
socket.on('unknownCode', handleUnknownCode);
socket.on('tooManyPlayers', handleTooManyPlayers);

const gameScreen = document.getElementById('gameScreen');
const initialScreen = document.getElementById('initialScreen');
const newGameBtn = document.getElementById('newGameButton');
const joinGameBtn = document.getElementById('joinGameButton');
const gameCodeInput = document.getElementById('gameCodeInput');
const gameCodeDisplay = document.getElementById('gameCodeDisplay');

newGameBtn.addEventListener('click', newGame);
joinGameBtn.addEventListener('click', joinGame);

function newGame() {
  socket.emit('newGame');
  init();
}

function joinGame() {
  const code = gameCodeInput.value;
  socket.emit('joinGame', code);
  init();
}

let canvas, ctx;
let playerNumber;
let gameActive = false;

function init() {
  initialScreen.style.display = "none";
  gameScreen.style.display = "block";

  SPRITE.src = 'media/sprite.png';

  CONTROLLER.activate(socket);

  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');

  canvas.width = 1200;
  canvas.height = 768;

  ctx.fillStyle = BG_COLOUR;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  gameActive = true;
}

function paintGame(state) {
  ctx.fillStyle = BG_COLOUR;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  paintPlayer(state.players[0], SNAKE_COLOUR);
  paintPlayer(state.players[1], 'red');
}

function paintPlayer(player, colour) {
  ctx.fillStyle = colour;

  ctx.drawImage(SPRITE, player.animation.frame * SPRITE_SIZE, 0, SPRITE_SIZE, SPRITE_SIZE, Math.floor(player.pos.x), Math.floor(player.pos.y), SPRITE_SIZE, SPRITE_SIZE);

  drawPlayerDiagnostics(player);
}

function handleInit(number) {
  playerNumber = number;

  CONTROLLER.activate(socket, playerNumber);
}

function handleGameState(gameState) {
  if (!gameActive) {
    return;
  }
  gameState = JSON.parse(gameState);
  requestAnimationFrame(() => {
    paintGame(gameState);
  });
}

function handleGameOver(data) {
  if (!gameActive) {
    return;
  }
  data = JSON.parse(data);

  gameActive = false;

  if (data.winner === playerNumber) {
    alert('You Win!');
  } else {
    alert('You Lose :(');
  }
}

function handleGameCode(gameCode) {
  gameCodeDisplay.innerText = gameCode;
}

function handleUnknownCode() {
  reset();
  alert('Unknown Game Code')
}

function handleTooManyPlayers() {
  reset();
  alert('This game is already in progress');
}

function reset() {
  playerNumber = null;
  gameCodeInput.value = '';
  initialScreen.style.display = "block";
  gameScreen.style.display = "none";
}

function drawPlayerDiagnostics(player) {
  let x = 0;

  if (player.id == 1) {
    x = 50
  } else if (player.id == 2) {
    x = (canvas.width / 2) + 50
  }

  ctx.font = "24px/28px monospace";

  ctx.fillText('pos.x: ' + numberStringFormatter(player.pos.x), x , 56);
  ctx.fillText('vel.x: ' + numberStringFormatter(player.vel.x), x , 84);
  ctx.fillText('dir.x: ' + numberStringFormatter(player.dir.x), x , 112);


  ctx.fillText('pos.y: ' + numberStringFormatter(player.pos.y), x + 300, 56);
  ctx.fillText('vel.y: ' + numberStringFormatter(player.vel.y), x + 300, 84);
  ctx.fillText('dir.y: ' + numberStringFormatter(player.dir.y), x + 300, 112);
}

function numberStringFormatter(number){

  number = number.toFixed(3);

  if ((number < 10 & number >= 0)) { // single digits

    return '   ' + number;

  } else if ((number < 100 & number >= 10) || (number > -10 & number < 0)) { // double digits (including -)

    return '  ' + number;

  } else if ((number < 1000 & number >= 100) || (number > -100 & number <= -10)) { // triple digits (including -)
    return ' ' + number;

  } else if ((number < 10000 & number >= 1000) || (number > -1000 & number <= -100)) { // quadruple digits (including -)

    return '' + number;

  } else {
    console.log("unhandled number size: " + number)
  }
}


