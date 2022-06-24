module.exports = {
    restrictGameBoundaries: (p, SPRITE_SIZE, SCREEN_WIDTH, SCREEN_HEIGHT) => {
        if (p.pos.x < 0) {
            p.vel.x = 0;
            p.pre.x = p.pos.x = 0;
        } else if (p.pos.x + SPRITE_SIZE > SCREEN_WIDTH) {
            p.vel.x = 0;
            p.pre.x = p.pos.x = SCREEN_WIDTH - SPRITE_SIZE;
        }

        if (p.pos.y < 0) {
            p.vel.y = 0;
            p.pre.y = p.pos.y = 0;
        } else if (p.pos.y + SPRITE_SIZE > SCREEN_HEIGHT) {
            p.vel.y = 0;
            p.pre.y = p.pos.y = SCREEN_HEIGHT - SPRITE_SIZE;
        }
    },

    setFlyingOrFalling: (p) => {
        if (Math.floor(p.pos.y) == Math.floor(p.pre.y)) {
            p.dir.y = 0;
        } else if (Math.floor(p.pos.y) > Math.floor(p.pre.y)) {
            p.dir.y = -1;
        } else {
            p.dir.y = 1;
        }
    },

    setPlayerOrientation: (p) => {
        if (Math.floor(p.pos.x) == Math.floor(p.pre.x)) {
            p.dir.x = 0;
        } else if (Math.floor(p.pos.x) > Math.floor(p.pre.x)) {
            p.dir.x = 1;
        } else {
            p.dir.x = -1;
        }
    },

    setIsGrounded: (p, SPRITE_SIZE, SCREEN_HEIGHT) => {
        if (p.pos.y + SPRITE_SIZE > SCREEN_HEIGHT - 2 - 0.1) {
            p.grounded = true;
            p.pos.y = SCREEN_HEIGHT - 2 - SPRITE_SIZE;
            p.vel.y = 0;
        }
        else {
            p.grounded = false;
        }
    },

    applyPhysics: (p, GRAVITY, FRICTION) => {
        p.vel.x *= FRICTION;
        p.vel.y += GRAVITY;
    },

    setPreviousPosition: (p) => {
        p.pre.x = p.pos.x;
        p.pre.y = p.pos.y;
    },

    setNewPosition: (p) => {
        p.pos.x += p.vel.x;
        p.pos.y += p.vel.y;
    },

    preventExponents: (v) => (v > 0 && v < 0.005) || (v < 0 && v > -0.005) ? 0 : v,

    setRoundedValues: (p) => {
        p.pos.x = parseFloat(parseFloat(p.pos.x).toFixed(3));
        p.pos.y = parseFloat(parseFloat(p.pos.y).toFixed(3));
        p.pre.x = parseFloat(parseFloat(p.pre.x).toFixed(3));
        p.pre.y = parseFloat(parseFloat(p.pre.y).toFixed(3));
        p.vel.x = parseFloat(parseFloat(p.vel.x).toFixed(3));
        p.vel.y = parseFloat(parseFloat(p.vel.y).toFixed(3));
    }

}