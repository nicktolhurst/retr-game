const { Animation } = require('./animation');


const Input = () => ({ active: false, state: false });

const state = {
  players: [{
    type: 'player',
    size: 32,
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
    type: 'player',
    size: 32,
    dir: {
      x: 0,
      y: 0
    },
    pos: {
      x: 600,
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
  }],
  world: {}
};

const PLAYER = {
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
  facing: 'right',
  grounded: true,
  animation: new Animation(),
  keys: {
    'left': Input(),
    'right': Input(),
    'up': Input(),
    'down': Input()
  }
}

const [_, X, I, W, C, O, T, m]
    = [0, 1, 2, 3, 4, 5, 6, 7]
//     L  D  R  W  C  S  L  L
//     A  I     A  L  K     E
//     N  R  W  T  O  Y  W  D
//     D  T  A  E  U     A  G
//           L  R  D     L  E
//           L           L

const WORLDS = {
  basic: {

    rows: 16,
    columns: 32,
    height: 16 * 32,
    width: 32 * 32,
    tile_size: 32,

    width_height_ratio: 32 / 16,

    tiles: [
    //1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32
      O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, // 1
      O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, // 2
      O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, // 3
      O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, // 4
      O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, // 5
      O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, // 6
      O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, m, m, O, O, O, O, O, // 7
      O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, O, _, _, // 8
      O, O, O, _, _, O, O, O, O, O, O, O, O, O, O, O, O, m, m, O, O, m, m, O, O, _, _, _, _, _, T, X, // 9
      O, O, O, T, I, _, _, O, O, O, O, O, O, O, O, O, m, O, O, O, O, O, O, _, _, T, X, X, X, X, X, X, // 10
      O, _, _, T, X, X, X, O, O, O, O, O, O, O, O, m, O, O, O, O, O, O, O, T, X, X, X, X, X, X, X, X, // 11
      _, T, X, I, O, O, O, O, m, m, O, O, O, O, O, _, _, O, O, O, O, O, O, O, O, O, O, O, O, O, O, T, // 12
      X, I, O, O, O, O, O, O, O, O, _, _, O, O, O, T, I, O, O, O, O, O, O, O, O, O, O, O, O, O, O, T, // 13
      I, O, O, O, O, O, O, O, _, _, T, I, _, _, _, T, I, _, _, O, O, O, _, _, _, O, O, O, O, O, O, T, // 14
      I, _, _, _, O, O, _, _, T, X, X, X, X, X, X, X, X, X, I, W, W, W, T, X, X, _, _, _, _, _, _, T, // 15
      X, X, X, I, W, W, T, X, X, X, X, X, X, X, X, X, X, X, I, W, W, W, T, X, X, X, X, X, X, X, X, X, // 16
    ]
  }
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function addPlayer(id) {
  const p = this.PLAYER;

  p.id = id;
  p.pos.x = getRndInteger(0, state.world.width);
  p.pos.y = getRndInteger(0, state.world.height);

  state.players.push(p);

  return state;
}

function addWorld(world) {
  state.world = world;
}

module.exports = { WORLDS, PLAYER, state, addPlayer, addWorld }