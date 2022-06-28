const { GRAVITY, FRICTION, FRAME_SET, SCREEN_WIDTH, SCREEN_HEIGHT, SPRITE_SIZE } = require('./constants');
const MECHANICS = require('./mechanics');
const ANIMATOR = require('./animator');
const { move } = require('./player');
const { Player, World } = require('./objects')

const state = {
  players: [],
  world: {},
  objects: [],
};

function initGame() {

  state.world = new World();

  state.players.push(new Player(300, 100, 32));

  state.players.push(new Player(800, 100, 32));

  state.players.forEach(player => {
    player.animation.change(FRAME_SET.face_forward);
  });

  return state;
  
}

function addObject(object){

  let player = state.players[object.player - 1];

  let startX = player.pos.x + (player.size / 2);
  let startY = player.pos.y + (player.size / 2);

  STATE.addObject({
    ...object,
    vel: MECHANICS.calculateTrajectory(startX, startY, object.dest.x, object.dest.y),
    pos: {
      x: startX,
      y: startY
    }
  });
}

function gameLoop(state) {

  if (!state) {
    return;
  }

  state.objects.forEach(object => {

    object.pos.x += object.vel.x;
    object.pos.y += object.vel.y;

    MECHANICS.destroyAtGameBoundaries(object, state);
    MECHANICS.setPreviousPosition(object, state);
    // MECHANICS.collide(object, state.world, true);

  });

  state.players.forEach(player => {
    
    if (player.mouse.active) {
      player.make.attack(18);
    }

    if (player.keys['up'].active && player.grounded == true) {
      player.make.jump(18);
    }

    if (player.keys['left'].active) {
      player.move.left(26);
    }

    if (player.keys['right'].active) {
      player.move.right(26);
    }

    if (player.keys['down'].active) {
      player.move.down(1.5);
a    }

    player.objects.forEach(object => {

      object.pos.x += object.vel.x;
      object.pos.y += object.vel.y;

      MECHANICS.destroyAtGameBoundaries(object, state);
      MECHANICS.setPreviousPosition(object, state);

    });

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
  addObject
}