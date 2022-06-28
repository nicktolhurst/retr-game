const FRAME_DELAY = 5;
const FRAME_RATE = 24;
const FRAME_SET = {
  face_forward: [0, 1],
  face_right:   [2],
  face_left:    [4],
  
  walk_right: [2, 3],
  walk_left:  [4, 5],

  jump_left:  [12],
  jump_right: [13],
  jump_forward: [16],

  fall_left: [15],
  fall_right: [14],
  fall_forward: [17],
}

const FRICTION = 0.19;
const GRAVITY = 1.9;
const SCREEN_WIDTH = 1200;
const SCREEN_HEIGHT = 768;
const GRID_SIZE = 20;
const SPEED = 5;
const JUMP_FORCE = 1;
const SPRITE_SIZE = 32;

module.exports = {
  FRAME_DELAY,
  FRAME_RATE,
  FRAME_SET,
  FRICTION,
  GRAVITY,
  GRID_SIZE,
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  SPEED,
  SPRITE_SIZE,
  JUMP_FORCE
}
