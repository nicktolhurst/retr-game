// Define sprites.
const SPRITE_SIZE = 32;
const PLAYER_SPRITES = [
  // At least 2 players. More can be pushed.
  new Image(),
  new Image(),
]
const WORLD_SPRITE = new Image();

let buffer, display;
let map_tiles;
let playerNumber;
let gameActive = false;

// Configure socket.io and connectivity to web socket server.
const host = new URL((window.location.href)).hostname;
const socket = io(host == 'retr-fe.herokuapp.com' ? 'https://retr-ws.herokuapp.com/' : 'http://localhost:3000');
socket.on('init', handleInit);
socket.on('gameState', handleGameState);
socket.on('gameOver', handleGameOver);
socket.on('gameCode', handleGameCode);
socket.on('unknownCode', handleUnknownCode);
socket.on('tooManyPlayers', handleTooManyPlayers);

// HTML elements for home screen..
const gameScreen = document.getElementById('gameScreen');
const initialScreen = document.getElementById('initialScreen');
const enableDiagnostics = document.getElementById('enableDiagnostics');
const newGameBtn = document.getElementById('newGameButton');
const joinGameBtn = document.getElementById('joinGameButton');
const gameCodeInput = document.getElementById('gameCodeInput');
const gameCodeDisplay = document.getElementById('gameCodeDisplay');

// Event listeners for home screen.
enableDiagnostics.addEventListener('click', handleEnableDiagnostics);
newGameBtn.addEventListener('click', handleNewGame);
joinGameBtn.addEventListener('click', handleJoinGame);

function handleEnableDiagnostics(event){

  if (!gameActive) { return; }

  GAME.Debugger.config.on = event.target.checked;
}
// Event handlers for home screen.
function handleNewGame() {
  socket.emit('newGame');
}

function handleJoinGame(code) {
  code = code ?? gameCodeInput.value;
  socket.emit('joinGame', code);
}

// URI string query parameters.
const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});

if (params.code) handleJoinGame(params.code);

///////////////////
// GAME LOGIC
//

function init(state) {

  // Switches out of home screen and into game screen.
  initialScreen.style.display = "none";
  gameScreen.style.display = "block";

  // Activates controller.
  // CONTROLLER.activate(socket);

  // Loads player sprites.
  PLAYER_SPRITES[0].src = 'media/player-1.png';
  PLAYER_SPRITES[1].src = 'media/player-2.png';

  // Loads world sprites.
  WORLD_SPRITE.src = 'media/world-basic.png';

  // The display canvas' context. Draw the tile buffer here.
  // It's important not to desynchronize when using CSS to scale.
  display = BUFFER.get(state.world.width, state.world.height, false, false);

  // The tile buffer canvas' context. Draw individual tiles here.
  buffer = BUFFER.create(state.world.width, state.world.height, false, true);

  GAME.Debugger = new GAME.plugins.PhysicsDebugger(buffer);

  console.log(GAME.Debug)

  display.drawImage(buffer.canvas,0,0)

  BUFFER.resize(display, state.world)

  window.addEventListener("resize", () => {
    BUFFER.resize(display, state.world)
    BUFFER.resize(buffer, state.world)
  });

  gameActive = true;
}

// Game loop.
function handleGameState(gameState) {
  if (!gameActive) {
    return;
  }
  gameState = JSON.parse(gameState);
  requestAnimationFrame(() => {
    paintGame(gameState);
  });
}

function paintGame(state) {

  BUFFER.paintWorld(buffer, state.world);

  BUFFER.paintPlayer(buffer, state.players[0], SPRITE_SIZE);
  BUFFER.paintPlayer(buffer, state.players[1], SPRITE_SIZE);

  display.drawImage(buffer.canvas, 0, 0);
}

function handleInit(data) {
  CONTROLLER.activate(socket, data.playerNumber);
  init(data.state);
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

function calculateTileSourcePosition(tile_index, tile_sheet_columns, size) {

  return {

    x: tile_index % tile_sheet_columns * size,
    y: Math.floor(tile_index / tile_sheet_columns) * size

  };

}

function drawPlayerDiagnostics(player) {
  let x = 0;

  if (player.id == 1) {
    x = 5
  } else if (player.id == 2) {
    x = (canvas.width / 2) + 5
  }

  buffer.font = "10px/12px monospace";

  buffer.fillText('pos.x: ' + numberStringFormatter(player.pos.x), x, 30);
  buffer.fillText('vel.x: ' + numberStringFormatter(player.vel.x), x, 45);
  buffer.fillText('dir.x: ' + numberStringFormatter(player.dir.x), x, 60);
  buffer.fillText('grndd: ' + boolStringFormatter(player.grounded), x, 75);
  buffer.fillText('f_set: ' + boolStringFormatter(player.animation.frame_set), x, 90);

  buffer.fillText('|  pos.y: ' + numberStringFormatter(player.pos.y), x + 230, 30);
  buffer.fillText('|  vel.y: ' + numberStringFormatter(player.vel.y), x + 230, 45);
  buffer.fillText('|  dir.y: ' + numberStringFormatter(player.dir.y), x + 230, 60);
  buffer.fillText('|  facng: ' + stringStringFormatter(player.facing), x + 230, 75);
  buffer.fillText('|  frame: ' + player.animation.frame, x + 230, 90);

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


