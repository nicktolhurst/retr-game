const io = require('socket.io')();
const { initGame, gameLoop, addObject } = require('./game');
const { FRAME_RATE } = require('./constants');
const { makeid } = require('./utils');
const COLLIDER = require('./collider')

const state = {};
const clientRooms = {};

io.on('connection', client => {

  client.on('keydownup', handleKeyupdown);
  client.on('mousedownup', handleMouseupdown);
  
  client.on('newGame', handleNewGame);
  client.on('joinGame', handleJoinGame);
  client.on('collision', handleCollision);
  client.on('getStateFor', handleGetStateFor);

  function handleGetStateFor(code) {

    if (!roomName) {
      client.emit('roomNotReady');
    }
    
    client.join(roomName);

    client.emit('init');
  }

  function handleJoinGame(roomName) {
    const room = io.sockets.adapter.rooms[roomName];

    let allUsers;
    if (room) {
      allUsers = room.sockets;
    }

    let numClients = 0;
    if (allUsers) {
      numClients = Object.keys(allUsers).length;
    }

    // Only allow 2 players (for now :D!)
    if (numClients === 0) {

      handleNewGame(roomName);
      return;

    } else if (numClients > 1) {

      client.emit('tooManyPlayers');
      return;

    }

    clientRooms[client.id] = roomName;

    client.join(roomName);
    client.number = 2;
    client.emit('gameCode', roomName);
    client.emit('init', { playerNumber: 2, state: state[roomName] });

    startGameInterval(roomName);
  }

  function handleNewGame(code) {

    roomName = code ?? makeid(5);

    clientRooms[client.id] = roomName;
    client.emit('gameCode', roomName);

    state[roomName] = initGame();

    client.join(roomName);
    client.number = 1;
    client.emit('init', { playerNumber: 1, state: state[roomName] });
  }

  function handleKeyupdown(keys) {

    const roomName = clientRooms[client.id];

    if (!roomName) {
      return;
    }

    // TODO: Handle player better. Suggest client name being ID for lookup.
    state[roomName].players[client.number - 1].keys = keys;
  }

  function handleMouseupdown(mouse) {

    const roomName = clientRooms[client.id];

    if (!roomName) {
      return;
    }

    // TODO: Handle player better. Suggest client name being ID for lookup.
    state[roomName].players[client.number - 1].mouse = mouse;
  }

  function handleCollision(data) {
    const player = state[roomName].players[client.number - 1];

    COLLIDER.addPrediction(player, data);
  }
});

function startGameInterval(roomName) {
  const intervalId = setInterval(() => {
    const winner = gameLoop(state[roomName]);

    if (!winner) {
      emitGameState(roomName, state[roomName])
    } else {
      emitGameOver(roomName, winner);
      state[roomName] = null;
      clearInterval(intervalId);
    }
  }, 1000 / FRAME_RATE);
}

function emitGameState(room, gameState) {
  io.sockets.in(room)
    .emit('gameState', JSON.stringify(gameState));
}

function emitGameOver(room, winner) {
  io.sockets.in(room)
    .emit('gameOver', JSON.stringify({ winner }));
}

io.listen(process.env.PORT || 3000);
