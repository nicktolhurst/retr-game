const { GRAVITY, FRICTION, FRAME_DELAY, FRAME_SETS, SCREEN_WIDTH, SCREEN_HEIGHT, SPRITE_SIZE } = require('./constants');
const MECHANICS = require('./mechanics');
const {move} = require('./player');

const Input = () => ({ active: false, state: false });

function initGame() {

  const state = {
    players: [{
      id: 1,
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
      grounded: true,
      animation: new Animation(),
      hp: {
        max: 30,
        left: 30
      },
      keys: {
        'left': Input(),
        'right': Input(),
        'up': Input(),
        'down': Input()
      }
    },
    {
      id: 2,
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
      grounded: true,
      animation: new Animation(),
      hp: {
        max: 30,
        left: 30
      },
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

  state.players.forEach(p => {

    if (p.keys['up'].active && p.grounded == true) make(p)['jump'](10);

    if (p.keys['left'].active)  move(p)['left'](5);
    if (p.keys['right'].active) move(p)['right'](5);


    MECHANICS.applyPhysics(p, GRAVITY, FRICTION);
    MECHANICS.setPreviousPosition(p);
    MECHANICS.setNewPosition(p);
    MECHANICS.grounded(p, SPRITE_SIZE, SCREEN_HEIGHT);
    MECHANICS.playerOrientation(p);
    MECHANICS.flyingOrFalling(p);
    MECHANICS.gameBoundaries(p, SPRITE_SIZE, SCREEN_WIDTH, SCREEN_HEIGHT);

    if (p.dir.y == -1 && p.dir.x == -1) { p.animation.change(FRAME_SETS[9], FRAME_DELAY) }     // fall left
    if (p.dir.y == -1 && p.dir.x == 1) { p.animation.change(FRAME_SETS[8], FRAME_DELAY) }      // fall right
    if (p.dir.y == -1 && p.dir.x == 0) { p.animation.change(FRAME_SETS[11], FRAME_DELAY) }     // fall forward

    if (p.dir.y == 1 && p.dir.x == -1) { p.animation.change(FRAME_SETS[6], FRAME_DELAY) }      // jump left
    if (p.dir.y == 1 && p.dir.x == 1) { p.animation.change(FRAME_SETS[7], FRAME_DELAY) }       // jump right
    if (p.dir.y == 1 && p.dir.x == 0) { p.animation.change(FRAME_SETS[10], FRAME_DELAY) }      // jump forward

    if (p.dir.y == 0 && p.dir.x == 1 && p.grounded) { p.animation.change(FRAME_SETS[1], FRAME_DELAY) }       // ground right
    if (p.dir.y == 0 && p.dir.x == -1 && p.grounded) { p.animation.change(FRAME_SETS[2], FRAME_DELAY) }      // ground left
    if (p.dir.y == 0 && p.dir.x == 0 && p.grounded) { p.animation.change(FRAME_SETS[0], FRAME_DELAY) }       // ground forward

    p.animation.update();
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