const { GRAVITY, FRICTION, FRAME_SET, SCREEN_WIDTH, SCREEN_HEIGHT, SPRITE_SIZE } = require('./constants');
const MECHANICS = require('./mechanics');
const ANIMATOR = require('./animator');
const STATE = require('./state');
const { move } = require('./player');

function initGame() {

  let state = STATE.state;

  STATE.addWorld(STATE.WORLDS.basic);

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
    MECHANICS.collide(player, state.world);
    
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