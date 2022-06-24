const BG_COLOUR = '#92A8D1';
const SNAKE_COLOUR = '#152238';
const FOOD_COLOUR = '#FF6F61';

const SPRITE_SIZE = 32;
const SPRITES = [
  new Image(),
  new Image()
]

const host = new URL((window.location.href)).hostname;

const socket = io(host == 'retr-fe.herokuapp.com' ? 'https://retr-ws.herokuapp.com/' : 'http://localhost:3000');

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

function joinGame(code) {
  code = code ?? gameCodeInput.value;
  socket.emit('joinGame', code);
  init();
}

let canvas, ctx;
let playerNumber;
let gameActive = false;

const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});

if (params.code) joinGame(params.code);

function init() {
  initialScreen.style.display = "none";
  gameScreen.style.display = "block";

  SPRITES[0].src = 'media/Player_1.png';
  SPRITES[1].src = 'media/Player_2.png';

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

  ctx.imageSmoothingEnabled = false;

  paintPlayer(state.players[0], SNAKE_COLOUR);
  paintPlayer(state.players[1], '#FF6F61');
}

function paintPlayer(player, colour) {
  ctx.fillStyle = colour;

  ctx.drawImage(SPRITES[player.id - 1], player.animation.frame * SPRITE_SIZE, 0, SPRITE_SIZE, SPRITE_SIZE, Math.floor(player.pos.x), Math.floor(player.pos.y), SPRITE_SIZE * player.scale, SPRITE_SIZE * player.scale);

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
  ctx.fillText('dir.x: ' + numberStringFormatter(player.dir.x), x, 112);
  ctx.fillText('grndd: ' + boolStringFormatter(player.grounded), x, 140);
  ctx.fillText('f_set: ' + boolStringFormatter(player.animation.frame_set), x, 168);

  ctx.fillText('|  pos.y: ' + numberStringFormatter(player.pos.y), x + 230, 56);
  ctx.fillText('|  vel.y: ' + numberStringFormatter(player.vel.y), x + 230, 84);
  ctx.fillText('|  dir.y: ' + numberStringFormatter(player.dir.y), x + 230, 112);
  ctx.fillText('|  facng: ' + stringStringFormatter(player.facing), x + 230, 140);
  ctx.fillText('|  frame: ' + player.animation.frame, x + 230, 168);

}

function boolStringFormatter(b) {
  let result;
  
  if (b) {
    result = '    ' + b.toString()
  } else {
    result = '   ' + b.toString()
  }
  
  return result
}

function stringStringFormatter(s) {

  const l = s.length;

  if (l == 4) {
    return '    ' + s
  } else if (l == 5) {
    return '   ' + s
  } else if (l == 7) {
    return ' ' + s
  } else {
    return s
  }
}

function numberStringFormatter(n) {

  n = n.toFixed(3);

  if ((n < 10 & n >= 0)) { // single digits

    return '   ' + n;

  } else if ((n < 100 & n >= 10) || (n > -10 & n < 0)) { // double digits (including -)

    return '  ' + n;

  } else if ((n < 1000 & n >= 100) || (n > -100 & n <= -10)) { // triple digits (including -)
    return ' ' + n;

  } else if ((n < 10000 & n >= 1000) || (n > -1000 & n <= -100)) { // quadruple digits (including -)

    return '' + n;

  } else {
    console.log("unhandled number size: " + n)
  }
}


