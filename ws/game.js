const { GRAVITY, FRICTION, FRAME_DELAY, FRAME_SETS, SCREEN_WIDTH, SCREEN_HEIGHT, SPRITE_SIZE } = require('./constants');
const MECHANICS = require('./mechanics');
const ANIMATOR = require('./animator');
const {move} = require('./player');

const Input = () => ({ active: false, state: false });

function initGame() {

  const state = {
    players: [{
      id: 1,
      scale: 5,
      dir: {
        x: 0,
        y: 0
      },
      pos: {
        x: 100,
        y: 400
      },
      pre: {
        x: 0,
        y: 0
      },
      vel: {
        x: 0,
        y: 0
      },
      facing: 'right',
      grounded: true,
      animation: new Animation(),
      keys: {
        'left': Input(),
        'right': Input(),
        'up': Input(),
        'down': Input()
      }
    },
    {
      id: 2,
      scale: 5,
      dir: {
        x: 0,
        y: 0
      },
      pos: {
        x: 700,
        y: 400
      },
      pre: {
        x: 0,
        y: 0
      },
      vel: {
        x: 0,
        y: 0
      },
      facing: 'left',
      grounded: true,
      animation: new Animation(),
      keys: {
        'left': Input(),
        'right': Input(),
        'up': Input(),
        'down': Input()
      }
    }]
  };

  state.players[0].animation.change(FRAME_SETS[0])
  state.players[1].animation.change(FRAME_SETS[1])

  return state;
}

function gameLoop(state) {
  if (!state) {
    return;
  }

  state.players.forEach(player => {

    if (player.keys['up'].active && player.grounded == true) {
      make(player)['jump'](10);
    } 

    if (player.keys['left'].active) {
      move(player)['left'](6);
    } 

    if (player.keys['right'].active) {
      move(player)['right'](6);
    }

    if (player.keys['down'].active) {
      move(player)['down'](10);
    }

    MECHANICS.applyPhysics(player, GRAVITY, FRICTION);
    MECHANICS.setNewPosition(player);
    MECHANICS.setIsGrounded(player, SPRITE_SIZE * player.scale, SCREEN_HEIGHT);
    MECHANICS.setPlayerOrientation(player);
    MECHANICS.setFlyingOrFalling(player);
    MECHANICS.restrictGameBoundaries(player, SPRITE_SIZE * player.scale, SCREEN_WIDTH, SCREEN_HEIGHT);
    MECHANICS.setPreviousPosition(player);

    player.vel.x = MECHANICS.preventExponents(player.vel.x);
    player.vel.y = MECHANICS.preventExponents(player.vel.y);

    MECHANICS.setRoundedValues(player);

    ANIMATOR.setPlayerAnimation(player, FRAME_SETS)
  });

  return false;
}

const Animation = function (frame_set = 0, delay) {

  this.count = 0;                 // Counts the number of game cycles since the last frame change.
  this.delay = delay;             // The number of game cycles to wait until the next frame change.
  this.frame = 0;                 // The value in the sprite sheet of the sprite image / tile to display.
  this.frame_index = 0;           // The frame's index in the current animation frame set.
  this.frame_set = frame_set;     // The current animation frame set that holds sprite tile values.
  this.lock = false;              // The current animation frame set that holds sprite tile values.

};

Animation.prototype = {

  change: function (frame_set, delay = FRAME_DELAY) {

    if (this.frame_set != frame_set && !this.lock) {    // If the frame set is different and not locked.

      this.lock = true;
      this.count = 0;                                 // Reset the count.
      this.delay = delay;                             // Set the delay.
      this.frame_index = 0;                           // Start at the first frame in the new frame set.
      this.frame_set = frame_set;                     // Set the new frame set.
      this.frame = this.frame_set[this.frame_index];  // Set the new frame value.

    }
  },

  /* Call this on each game cycle. */
  update: function () {

    this.count++;

    if (this.count >= this.delay) {

      this.count = 0;
      this.frame_index = (this.frame_index == this.frame_set.length - 1) ? 0 : this.frame_index + 1;
      this.frame = this.frame_set[this.frame_index];

    }

    if (this.frame_index == (this.frame_set.length - 1)) {

      this.lock = false;

    }
  }

};

module.exports = {
  initGame,
  gameLoop,
}