const UUID = require('uuid');
const { Animation } = require('./animation');
const { calculateTrajectory } = require('./mechanics');

class Object {
    constructor(posX = 0, posY = 0, size = 32, spriteUri = undefined) {
        this.id = UUID.v4();
        this.type = 'object';
        this.size = size;
        this.pos = {
            x: posX,
            y: posY
        }
        this.pre = {
            x: 0,
            y: 0
        }
        this.dir = {
            x: 0,
            y: 0
        }
        this.vel = {
            x: 0,
            y: 0
        }
        this.destroyOnImpact = false;
        this.animation = new Animation();
        this.spriteUri = spriteUri;
    }
};

class Player extends Object {
    constructor(posX = 0, posY = 0, size = 32, spriteUri = null) {
        super(posX, posY, size, spriteUri);
        super.type = 'player';

        const Input = () => ({ active: false, state: false });

        this.facing = 'right';
        this.grounded = false;
        this.weapon = 'bullet';
        this.keys = {
            'left': Input(),
            'right': Input(),
            'up': Input(),
            'down': Input()
        };
        this.mouse = {
            ...Input(),
            x: 0,
            y: 0
        };
        this.objects = []
    }
    
    move = {

        'left': (force) => {
            this.facing = 'left';
            this.vel.x -= force;
        },

        'right': (force) => {
            this.facing = 'right';
            this.vel.x += force
        },

        'down': (force) => {
            this.facing = 'forward';
            this.vel.y += force
        },

    }

    make = {

        'jump': (force) => {
            this.keys['up'].active = false;
            this.vel.y -= force
        },

        'attack': (force) => {
            this.mouse.active = false;

            switch (this.weapon) {

                case 'bullet':
                    this.objects.push(new Bullet(this.mouse.x, this.mouse.y, this.pos.x, this.pos.y, 2, 25));
                    break;

                case 'rock':
                    this.objects.push(new Rock(this.mouse.x, this.mouse.y, this.pos.x, this.pos.y, 5, 8));
                    break;

                default:
                    break;

            }
            
        },
    }
};

class BallisticObject extends Object {
    constructor(destX, destY, posX, posY, size, speed, spriteUri = null) {
        super(posX, posY, size, spriteUri);
        super.destroyOnImpact = true;
        super.type = 'ballistic-object';

        this.dest = {
            x: destX,
            y: destY
        }
        this.speed = speed
        this.vel = calculateTrajectory(posX, posY, destX, destY)
    }
};

class Bullet extends BallisticObject {
    constructor(destX, destY, posX, posY, size, speed, spriteUri = null) {
        super(destX, destY, posX, posY, size, speed, spriteUri);
        super.type = 'bullet';

        this.damage = 10;
    }
};

class Rock extends BallisticObject {
    constructor(destX, destY, posX, posY, size, speed, spriteUri = null) {
        super(destX, destY, posX, posY, size, speed, spriteUri);
        super.type = 'rock';

        this.damage = 1;
    }
};

class World {
    constructor() {
        const [_, X, I, W, C, O, T, m]
            = [0, 1, 2, 3, 4, 5, 6, 7]
        //     L  D  R  W  C  S  L  L
        //     A  I     A  L  K     E
        //     N  R  W  T  O  Y  W  D
        //     D  T  A  E  U     A  G
        //           L  R  D     L  E
        //           L           L

        this.rows = 16;
        this.columns = 32;
        this.height = 16 * 32;
        this.width = 32 * 32;
        this.tile_size = 32;
        this.width_height_ratio = 32 / 16;

        this.tiles = [
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

module.exports = { Player, Bullet, Rock, World }
