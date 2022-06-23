let p

move = (player) => {
    p = player;
    return direction;
}

make = (player) => {
    p = player;
    return direction;
}

const direction = {

    'left': (f) => { 
        p.vel.x -= f 
    },

    'right': (f) => { 
        p.vel.x += f 
    },

    'jump': (f) => { 
        p.keys['up'].active = false; 
        p.vel.y -= f 
    },
};

module.exports = {
    move,
    make
}



