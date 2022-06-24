module.exports = {

    setPlayerAnimation: (p, FRAME_SET) => {

        let frame_set = FRAME_SET.face_forward, delay

        // Handle which way the player is facing when standing still and on the ground.
        frame_set =
            p.facing == 'left' && p.grounded ? FRAME_SET.face_left
                : p.facing == 'right' && p.grounded ? FRAME_SET.face_right
                    : p.facing == 'forward' && p.grounded ? FRAME_SET.face_forward
                        : frame_set;


        // Handle the player walking left or right.
        frame_set =
            p.facing == 'left' && p.grounded && (p.vel.x != 0) ? FRAME_SET.walk_left
                : p.facing == 'right' && p.grounded && (p.vel.x != 0) ? FRAME_SET.walk_right
                    : frame_set;


        // Handle left jumping and falling
        frame_set =
            p.facing == 'left' ?
                p.dir.y == 1 && !p.grounded ? FRAME_SET.jump_left
                    : p.dir.y <= 0 && !p.grounded ? FRAME_SET.fall_left : frame_set : frame_set

        // Handle right jumping and falling
        frame_set
            = p.facing == 'right' ?
                p.dir.y == 1 && !p.grounded ? FRAME_SET.jump_right
                    : p.dir.y <= 0 && !p.grounded ? FRAME_SET.fall_right : frame_set : frame_set

        // Handle forwards jumping and falling
        frame_set =
            p.facing == 'forward' || 0.5 > p.vel.x && p.vel.x > -0.5  ?
            p.dir.y == 1 && !p.grounded ? FRAME_SET.jump_forward
                    : p.dir.y == -1 && !p.grounded ? FRAME_SET.fall_forward : frame_set : frame_set

        p.animation.change(frame_set, delay)

        p.animation.update();

    }

}