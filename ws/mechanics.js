module.exports = {
    gameBoundaries: (p, SPRITE_SIZE, SCREEN_WIDTH, SCREEN_HEIGHT) => {
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

        return this;
    },

    flyingOrFalling: (p) => {
        if (Math.floor(p.pos.y) == Math.floor(p.pre.y)) {
            p.dir.y = 0;
        } else if (Math.floor(p.pos.y) > Math.floor(p.pre.y)) {
            p.dir.y = -1;
        } else {
            p.dir.y = 1;
        }

        return this;
    },

    playerOrientation: (p) => {
        if (Math.floor(p.pos.x) == Math.floor(p.pre.x)) {
            p.dir.x = 0;
        } else if (Math.floor(p.pos.x) > Math.floor(p.pre.x)) {
            p.dir.x = 1;
        } else {
            p.dir.x = -1;
        }

        return this;
    },

    grounded: (p, SPRITE_SIZE, SCREEN_HEIGHT) => {
        if (p.pos.y + SPRITE_SIZE > SCREEN_HEIGHT - 2) {
            p.grounded = true;
            p.pos.y = SCREEN_HEIGHT - 2 - SPRITE_SIZE;
            p.vel.y = 0;
        }
        else {
            p.grounded = false;
        }

        return this;
    },

    applyPhysics: (p, GRAVITY, FRICTION) => {
        p.vel.x *= FRICTION;
        p.vel.y += GRAVITY;

        return this;
    },

    setPreviousPosition: (p) => {
        p.pre.x = p.pos.x;
        p.pre.y = p.pos.y;

        return this;
    },

    setNewPosition: (p) => {
        p.pos.x += p.vel.x;
        p.pos.y += p.vel.y;

        return this;
    },
}