(function () {
    "use strict";

    const PhysicsDebugger = (function (ctx) {
        let coral, red, green, white

        coral = "hsla(15 , 100%,  50%, 0.5)";
        red     = "hsla(0  , 100%,  50%, 0.5)";
        // orange  = "hsla(30 , 100%,  50%, 0.5)";
        // mango   = "hsla(45 , 100%,  50%, 0.5)";
        // yellow  = "hsla(60 , 100%,  50%, 0.5)";
        // umber   = "hsla(60 , 100%,  25%, 0.5)";
        green   = "hsla(120, 100%,  50%, 0.5)";
        // flora   = "hsla(150, 100%,  50%, 0.5)";
        // aqua    = "hsla(180, 100%,  50%, 0.5)";
        // blue    = "hsla(210, 100%,  50%, 0.5)";
        // violet  = "hsla(300, 100%,  50%, 0.5)";
        // white   = "hsla(0  ,   0%, 100%, 0.5)";
        // gray    = "hsla(0  ,   0%,  50%, 0.5)";

        this.config = {

            on: false,
            player: {
                showEdges: true,
                showDiagonals: true, 
            },
            tile: {
                showGrid: true,
                showTileOffset: true,
            },
            collision: {
                showGrid: true
            },
            fillBody: false,
            lineWidth: 1,
            renderPlayer: true

        };

        this.colours = {

            player: coral,
            movement: red,
            tile: green,
            collision: white,

        };

        this.render = {

            allEdges: renderAllEdges,
            // leftEdge: renderLeftEdge,
            // rightEdge: renderRightEdge,
            // topEdge: renderTopEdge,
            // bottomEdge: renderBottomEdge,
            diagonals: renderDiagonals,

        }

        this.ctx = ctx;
    });

    PhysicsDebugger.prototype = {
        // configKeys: Object.keys(DEBUG.prototype.config),

        debug: function (obj) {
            
            if(!this.config.on) { return}

            obj.bottom      = obj.pos.y + obj.size;
            obj.left        = obj.pos.x;
            obj.top         = obj.pos.y;
            obj.right       = obj.pos.x + obj.size;
            obj.lineWidth   = obj.lineWidth ?? this.config.lineWidth;
            obj.colour      = obj.colour ?? this.colours[obj.type];

            switch (obj.type) {

                case 'player':

                    if (this.config[obj.type].showEdges) {
                        this.render.allEdges(obj, this.ctx);
                    }

                    if (this.config[obj.type].showDiagonals) {
                        this.render.diagonals(obj, this.ctx);
                    }

                    break;

                case 'tile':

                    if (this.config[obj.type].showGrid) {
                        this.render.allEdges(obj, this.ctx);
                    }
            
                    break;

                case 'collision':

                    if (this.config[obj.type].showGrid) {
                        this.render.allEdges(obj, this.ctx);
                    }

                    break;

                default:
                    break;
            }

        }
    }

    function renderAllEdges(obj, ctx) {

        renderLeftEdge(obj, ctx);
        renderRightEdge(obj, ctx);
        renderTopEdge(obj, ctx);
        renderBottomEdge(obj, ctx);
   
    }

    function renderDiagonals(obj, ctx) {

        renderAscendingDiagonal(obj, ctx);
        renderDescendingDiagonal(obj, ctx);

    }

    function renderLeftEdge(obj, ctx) {

        ctx.strokeStyle = obj.colour;
        ctx.lineWidth = obj.lineWidth;

        ctx.beginPath();
        ctx.moveTo(obj.left, obj.bottom);
        ctx.lineTo(obj.left, obj.top);
        ctx.stroke();
    };

    function renderRightEdge(obj, ctx) {
        ctx.strokeStyle = obj.colour;
        ctx.lineWidth = obj.lineWidth;

        ctx.beginPath();
        ctx.moveTo(obj.right, obj.bottom);
        ctx.lineTo(obj.right, obj.top);
        ctx.stroke();
    };

    function renderBottomEdge(obj, ctx) {
        ctx.strokeStyle = obj.colour;
        ctx.lineWidth = obj.lineWidth;

        ctx.beginPath();
        ctx.moveTo(obj.right, obj.bottom);
        ctx.lineTo(obj.left, obj.bottom);
        ctx.stroke();
    };

    function renderTopEdge(obj, ctx) {
        ctx.strokeStyle = obj.colour;
        ctx.lineWidth = obj.lineWidth;

        ctx.beginPath();
        ctx.moveTo(obj.right, obj.top);
        ctx.lineTo(obj.left, obj.top);
        ctx.stroke();
    };

    function renderAscendingDiagonal(obj, ctx) {
        ctx.strokeStyle = obj.colour;
        ctx.lineWidth = obj.lineWidth;

        ctx.beginPath();
        ctx.moveTo(obj.left, obj.bottom);
        ctx.lineTo(obj.right, obj.top);
        ctx.stroke();
    };

    function renderDescendingDiagonal(obj, ctx) {
        ctx.strokeStyle = obj.colour;
        ctx.lineWidth = obj.lineWidth;

        ctx.beginPath();
        ctx.moveTo(obj.left, obj.top);
        ctx.lineTo(obj.right, obj.bottom);
        ctx.stroke();
    };

    GAME.plugins.PhysicsDebugger = PhysicsDebugger;

})();



// function drawPlayerDiagnostics(player) {
//     let x = 0;

//     if (player.id == 1) {
//         x = 5
//     } else if (player.id == 2) {
//         x = (canvas.width / 2) + 5
//     }

//     buffer.font = "10px/12px monospace";

//     buffer.fillText('pos.x: ' + numberStringFormatter(player.pos.x), x, 30);
//     buffer.fillText('vel.x: ' + numberStringFormatter(player.vel.x), x, 45);
//     buffer.fillText('dir.x: ' + numberStringFormatter(player.dir.x), x, 60);
//     buffer.fillText('grndd: ' + boolStringFormatter(player.grounded), x, 75);
//     buffer.fillText('f_set: ' + boolStringFormatter(player.animation.frame_set), x, 90);

//     buffer.fillText('|  pos.y: ' + numberStringFormatter(player.pos.y), x + 230, 30);
//     buffer.fillText('|  vel.y: ' + numberStringFormatter(player.vel.y), x + 230, 45);
//     buffer.fillText('|  dir.y: ' + numberStringFormatter(player.dir.y), x + 230, 60);
//     buffer.fillText('|  facng: ' + stringStringFormatter(player.facing), x + 230, 75);
//     buffer.fillText('|  frame: ' + player.animation.frame, x + 230, 90);

// }

// function boolStringFormatter(b) {
//     let result;

//     if (b) {
//         result = '    ' + b.toString()
//     } else {
//         result = '   ' + b.toString()
//     }

//     return result
// }

// function stringStringFormatter(s) {

//     const l = s.length;

//     if (l == 4) {
//         return '    ' + s
//     } else if (l == 5) {
//         return '   ' + s
//     } else if (l == 7) {
//         return ' ' + s
//     } else {
//         return s
//     }
// }

// function numberStringFormatter(n) {

//     n = n.toFixed(3);

//     if ((n < 10 & n >= 0)) { // single digits

//         return '   ' + n;

//     } else if ((n < 100 & n >= 10) || (n > -10 & n < 0)) { // double digits (including -)

//         return '  ' + n;

//     } else if ((n < 1000 & n >= 100) || (n > -100 & n <= -10)) { // triple digits (including -)
//         return ' ' + n;

//     } else if ((n < 10000 & n >= 1000) || (n > -1000 & n <= -100)) { // quadruple digits (including -)

//         return '' + n;

//     } else {
//         console.log("unhandled number size: " + n)
//     }
// }


