const FRAME_DELAY = 5;
const FRAME_RATE = 24;
const FRAME_SETS = [
  [0, 1],             //  0: face forward.
  [2, 3],             //  1: face right.
  [4, 5],             //  2: face left.
  [6, 7, 8],          //  3: punch right.
  [9, 10, 11],        //  4: punch right.
  [9, 10, 11],        //  5: punch right.
  [12],               //  6: jump left.
  [13],               //  7: jump right
  [14],               //  8: fall right
  [15],               //  9: fall left
  [16],               // 10: jump forward
  [17],               // 11: fall forward
]
const FRICTION = 0.6;
const GRAVITY = 0.6;
const SCREEN_WIDTH = 1200;
const SCREEN_HEIGHT = 768;
const GRID_SIZE = 20;
const SPEED = 5;
const JUMP_FORCE = 3;
const SPRITE_SIZE = 32 * 2.5;

module.exports = {
  FRAME_DELAY,
  FRAME_RATE,
  FRAME_SETS,
  FRICTION,
  GRAVITY,
  GRID_SIZE,
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  SPEED,
  SPRITE_SIZE,
  JUMP_FORCE
}
