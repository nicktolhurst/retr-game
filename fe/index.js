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
GAME.socket = io(new URL((window.location.href)).hostname == 'retr-fe.herokuapp.com' ? 'https://retr-ws.herokuapp.com/' : 'http://localhost:3000');

// Set the web socket listeners.
GAME.socket.on('init', handleInit);
GAME.socket.on('gameState', handleGameState);
GAME.socket.on('gameOver', handleGameOver);
GAME.socket.on('gameCode', handleGameCode);
GAME.socket.on('unknownCode', handleUnknownCode);
GAME.socket.on('tooManyPlayers', handleTooManyPlayers);

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
  GAME.socket.emit('newGame');
}

function handleJoinGame(code) {
  code = code ?? gameCodeInput.value;
  GAME.socket.emit('joinGame', code);
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
    
    COLLIDER.predictCollision(gameState.players[playerNumber - 1], gameState.world);

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
  playerNumber = data.playerNumber
  CONTROLLER.activate();
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
