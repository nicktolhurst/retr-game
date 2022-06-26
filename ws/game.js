const { GRAVITY, FRICTION, FRAME_SET, SCREEN_WIDTH, SCREEN_HEIGHT, SPRITE_SIZE } = require('./constants');
const MECHANICS = require('./mechanics');
const ANIMATOR = require('./animator');
const STATE = require('./state');
const {move} = require('./player');
const COLLISIONS = require('./collisions')

function initGame() {

  let state = STATE.state;

  STATE.addWorld(STATE.WORLDS.basic);

  // STATE.addPlayer(1);
  // STATE.addPlayer(2);

  state.players[0].animation.change(FRAME_SET.face_forward)
  state.players[1].animation.change(FRAME_SET.face_forward)

  return state;
}

function gameLoop(state) {

  if (!state) {
    return;
  }

  state.players.forEach(player => {

    if (player.keys['up'].active && player.grounded == true) {
      make(player)['jump'](18);
    } 

    if (player.keys['left'].active) {
      move(player)['left'](22);
    } 

    if (player.keys['right'].active) {
      move(player)['right'](22);
    }

    if (player.keys['down'].active) {
      move(player)['down'](1.5);
    }

    MECHANICS.applyPhysics(player, GRAVITY, FRICTION);
    MECHANICS.setPreviousPosition(player);
    MECHANICS.setNewPosition(player);
    MECHANICS.setIsGrounded(player, SPRITE_SIZE, state.world.height);
    MECHANICS.setPlayerOrientation(player);
    MECHANICS.setFlyingOrFalling(player);
    MECHANICS.restrictGameBoundaries(player, SPRITE_SIZE, state.world.width, state.world.height);

    var y_offset = (32 / 5);
    var tile_x = Math.floor((player.pos.x + 32 * 0.5) / 32);
    var tile_y = Math.floor((player.pos.y + 32 - y_offset) / 32);
    var value_at_index = state.world.tiles[tile_y * state.world.columns + tile_x];

    COLLISIONS[value_at_index](player, tile_y, tile_x, y_offset, 32);

    tile_x = Math.floor((player.pos.x + 32 * 0.5) / 32);
    tile_y = Math.floor((player.pos.y + 32 - y_offset) / 32);
    value_at_index = state.world.tiles[tile_y * state.world.columns + tile_x];

    COLLISIONS[value_at_index](player, tile_y, tile_x, 32);

    player.vel.x = MECHANICS.preventExponents(player.vel.x);
    player.vel.y = MECHANICS.preventExponents(player.vel.y);

    MECHANICS.setRoundedValues(player);

    ANIMATOR.setPlayerAnimation(player, FRAME_SET)
  });

  return false;
}

module.exports = {
  initGame,
  gameLoop,
}