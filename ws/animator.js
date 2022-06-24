module.exports = {
  
    setPlayerAnimation: (p, FRAME_SETS) => {

        if (true == false) {

        } else if (p.dir.y == -1 && p.dir.x == -1 && p.facing == 'left') {

            p.animation.change(FRAME_SETS[9], 5)

        } else if (p.dir.y == -1 && p.dir.x == 1 && p.facing == 'right') {

            p.animation.change(FRAME_SETS[8], 5) 

        } else if (p.dir.y == -1 && p.dir.x == 0 && p.facing == 'foward') {

            p.animation.change(FRAME_SETS[11], 5)

        } else if (p.dir.y == 1 && p.dir.x == -1 && p.facing == 'left') {

            p.animation.change(FRAME_SETS[6], 5) 

        } else if (p.dir.y == 1 && p.dir.x == 1 && p.facing == 'right') {

            p.animation.change(FRAME_SETS[7], 5)

        } else if (p.dir.y == 1 && p.dir.x == 0 && p.facing == 'foward') {

            p.animation.change(FRAME_SETS[10], 5) 

        } else if (p.dir.y == 0 && p.dir.x == 1 && p.grounded && p.facing == 'right') {

            p.animation.change(FRAME_SETS[1], 5)

        } else if (p.dir.y == 0 && p.dir.x == -1 && p.grounded && p.facing == 'left') {

            p.animation.change(FRAME_SETS[2], 5)

        } else if (p.facing == 'forward' && Math.floor(p.dir.y) == 0 && p.grounded) {

            p.animation.change(FRAME_SETS[1], 5) 

        } else if (Math.floor(p.vel.x) == 0 && p.facing == 'left' && p.grounded) {
            
            p.animation.change(FRAME_SETS[13], 5)

        } else if (Math.floor(p.vel.x) == 0 && p.facing == 'right' && p.grounded) {

            p.animation.change(FRAME_SETS[12], 5)

        } else if (Math.floor(p.vel.x) == 0 && p.facing == 'down' && p.grounded) {

            p.animation.change(FRAME_SETS[0], 5)

        }

        p.animation.update();

    }

}