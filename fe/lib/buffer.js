const BUFFER = (() => {

    function create (width, height, alpha = false, desynchronized = true) {

        const buffer = document.createElement('canvas').getContext('2d', { alpha, desynchronized });

        configure(buffer, width, height);

        return buffer;
    }

    function get(width, height, alpha = false, desynchronized = true) {

        const buffer = document.querySelector('canvas').getContext('2d', { alpha, desynchronized });

        configure(buffer, width, height);

        return buffer;
    }

    function configure(buffer, width, height) {

        buffer.canvas.height = height;
        buffer.canvas.width = width;
        buffer.imageSmoothingEnabled = false;

    }

    function resize (display, world, padding = 150) {

        // Get the height and width of the window
        var height = document.documentElement.clientHeight;
        var width = document.documentElement.clientWidth;

        // This makes sure the DISPLAY canvas is resized in a way that maintains the MAP's width / height ratio.
        if (width / height < world.width_height_ratio) height = Math.floor(width / world.width_height_ratio);
        else width = Math.floor(height * world.width_height_ratio);

        // This sets the CSS of the DISPLAY canvas to resize it to the scaled height and width.
        display.canvas.style.height = (height - padding) + 'px';
        display.canvas.style.width = (width - padding) + 'px';

    }

    function paintWorld(buffer, world) {

        var map_index = 0;

        for (var top = 0; top < world.height; top += world.tile_size) {

            for (var left = 0; left < world.width; left += world.tile_size) {
                var tile_value = world.tiles[map_index];

                map_index++;

                if (tile_value == -1) continue;

                var tile_source_position = calculateTileSourcePosition(tile_value, 3, world.tile_size);

                buffer.drawImage(WORLD_SPRITE, tile_source_position.x, tile_source_position.y, world.tile_size, world.tile_size, left, top, world.tile_size, world.tile_size);

                GAME.Debugger.debug({
                    type: 'tile',
                    pos: { x: left, y: top, },
                    size: world.tile_size
                });
            }
        }

        return buffer;
    }

    function paintPlayers(buffer, players) {

        players.forEach(player => {
            const index = players.map(player => player.id).indexOf(player.id);

            buffer.drawImage(PLAYER_SPRITES[index], player.animation.frame * player.size, 0, player.size, player.size, Math.floor(player.pos.x), Math.floor(player.pos.y), player.size, player.size);


            player.objects.forEach(object => {
                buffer.beginPath();
                buffer.arc(object.pos.x, object.pos.y, 3, 0, 2 * Math.PI, false);
                buffer.fillStyle = 'black';
                buffer.fill();

                GAME.Debugger.debug(object);
            });

            GAME.Debugger.debug(player);
        })
    }

    function paintObjects(buffer, object) {

        object.forEach(object => {
            buffer.beginPath();
            buffer.arc(object.pos.x, object.pos.y, 3, 0, 2 * Math.PI, false);
            buffer.fillStyle = 'black';
            buffer.fill();

            GAME.Debugger.debug(object);
        });
        
    }

    return { create, get, resize, paintWorld, paintPlayers, paintObjects };

})();