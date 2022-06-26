const COLLIDER = (() => {

    const predict = {

        /* Land */
        0: function (object, row, column, y_offset, size) {
            if (topCollision(object, row, y_offset, size)) { return; };
        },

        /* Dirt */
        1: function (object, row, column, y_offset, size) {
            if (topCollision(object, row, y_offset, size)) { return; };
            if (rightCollision(object, column, size)) { return; };
            leftCollision(object, column, size);
        },

        /* Right Wall */
        2: function (object, row, column, y_offset, size) {
            if (rightCollision(object, column, size)) { return; };
        },

        /* Water */
        3: function (object, row, column, y_offset, size) { },

        /* Cloud */
        4: function (object, row, column, y_offset, size) { },

        /* Sky */
        5: function (object, row, column, y_offset, size) { },

        /* Left Wall */
        6:  function (object, row, column, y_offset, size) {
            if (leftCollision(object, column, size)) { return; };
        },
        
        /* Ledge */
        7: function (object, row, column, y_offset, size) { // Ledge
            if (topCollision(object, row, column, size)) { return; };
        },
        
    }

    function topCollision(object, row, y_offset, size) {

        if (object.vel.y > 0) {

            let top = row * size;

            if (object.pos.y + y_offset > top && object.pre.y + y_offset <= top) {

                const prediction = {
                    grounded: true,
                    vel: { y: 0 },
                    pre: { y: (row * size) - y_offset - 0.001 },
                    pos: { y: (row * size) - y_offset - 0.001 },
                }

                GAME.socket.emit('collision', prediction);

                // object.grounded = prediction.grounded;
                // object.vel.y = prediction.vel.y;
                // object.pre.y = prediction.pre.y;

                return true;
            }
        }
        return false;
    }


    function leftCollision(object, column, size) {

        if (object.vel.x > 0) {

            let left = column * size;

            if (object.pos.x + size * 0.5 > left && object.pre.x + size * 0.5 <= left) {
                
                const prediction = {
                    vel: { x: 0 },
                    pre: { x: left - size * 0.5 - 0.001 },
                    pos: { x: left - size * 0.5 - 0.001 },
                }

                GAME.socket.emit('collision', prediction);

                // object.vel.x = prediction.vel.x;
                // object.pre.x = prediction.pre.x;

                return true;
            }
        }
        return false;
    }

    function rightCollision(object, column, row, size) {

        if (object.vel.x < 0) {

            let right = ((column + 1) * size);

            if (object.pos.x + size * 0.5 < right && object.pre.x + size * 0.5 >= right) {
                
                const prediction = {
                    vel: { x: 0 },
                    pre: { x: right - size * 0.5 },
                    pos: { x: right - size * 0.5 },
                }

                GAME.socket.emit('collision', prediction);

                // object.vel.x = prediction.vel.x;
                // object.pre.x = prediction.pre.x;

                return true;
            }
        }
        return false;
    }

    function predictCollision(player, world) {

        var y_offset = (32 / 5);

        var tile_x = Math.floor((player.pos.x + player.size * 0.5) / world.tile_size);
        var tile_y = Math.floor((player.pos.y + player.size - y_offset) / world.tile_size);
        var value_at_index = world.tiles[tile_y * world.columns + tile_x];

        // predict[value_at_index](player, tile_y, tile_x, y_offset, world.tile_size)

        tile_x = Math.floor((player.pos.x + player.size * 0.5) / world.tile_size);
        tile_y = Math.floor((player.pos.y + player.size - y_offset) / world.tile_size);
        value_at_index = world.tiles[tile_y * world.columns + tile_x];

        // predict[value_at_index](player, tile_y, tile_x, y_offset, world.tile_size)

        // GAME.Debugger.debug({
        //     type: 'collision',
        //     pos: {
        //         x: tile_x * 32,
        //         y: tile_y * 32,
        //     },
        //     size: world.tile_size
        // });
    }

    return { predictCollision };

})();