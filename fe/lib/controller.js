const CONTROLLER = (() => {

    const Input = () => ({ active: false, state: false });

    function activate(ctx) {
        document.addEventListener('keyup', keyDownUpHandler);
        document.addEventListener('keydown', keyDownUpHandler);
        ctx.canvas.addEventListener('mousedown', mouseDownUpHandler)
        ctx.canvas.addEventListener('mouseup', mouseDownUpHandler)
    }

    const mouse = {
        ...Input(),
        x: 0,
        y: 0
    }

    console.log(mouse);

    const keys = {
        'left': Input(),
        'right': Input(),
        'up': Input(),
        'down': Input(),
        'space': Input(),
    }

    function mouseDownUpHandler(event) {
        const pointer = getRealCursorPosition(event.offsetX, event.offsetY, display.canvas.width, display.canvas.height);

        var state = event.type == 'mousedown';

        trigger(mouse, state);

        GAME.socket.emit('mousedownup', { ...mouse, ...pointer, });
    }

    function keyDownUpHandler(event) {
        event.preventDefault();


        var state = event.type == 'keydown';

        switch (event.keyCode) {
            case 65:
            case 37: 
                trigger(keys.left, state); 
                break;
            case 87: 
            case 38: 
                trigger(keys.up, state); 
                break;
            case 39:
            case 68: 
                trigger(keys.right, state); 
                break;
            case 83: 
            case 40: 
                trigger(keys.down, state); 
                break;
            case 32: 
                trigger(keys.space, state); 
        }

        GAME.socket.emit('keydownup', keys);
    }

    function trigger(input, state) { if (state !== input.state) input.active = input.state = state; }

    return { activate };

})();   