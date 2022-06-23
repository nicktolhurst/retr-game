module.exports = {
  
    setPlayerAnimation: (p, FRAME_SETS) => {
        if (p.dir.y == -1 && p.dir.x == -1) { p.animation.change(FRAME_SETS[9], 5) }     // fall left
        if (p.dir.y == -1 && p.dir.x == 1) { p.animation.change(FRAME_SETS[8], 5) }      // fall right
        if (p.dir.y == -1 && p.dir.x == 0) { p.animation.change(FRAME_SETS[11], 5) }     // fall forward

        if (p.dir.y == 1 && p.dir.x == -1) { p.animation.change(FRAME_SETS[6], 5) }      // jump left
        if (p.dir.y == 1 && p.dir.x == 1) { p.animation.change(FRAME_SETS[7], 5) }       // jump right
        if (p.dir.y == 1 && p.dir.x == 0) { p.animation.change(FRAME_SETS[10], 5) }      // jump forward

        if (p.dir.y == 0 && p.dir.x == 1 && p.grounded) { p.animation.change(FRAME_SETS[1], 5) }       // ground right
        if (p.dir.y == 0 && p.dir.x == -1 && p.grounded) { p.animation.change(FRAME_SETS[2], 5) }      // ground left
        if (p.dir.y == 0 && p.dir.x == 0 && p.grounded) { p.animation.change(FRAME_SETS[0], 5) }   
        
        p.animation.update();// ground forward
    }

}