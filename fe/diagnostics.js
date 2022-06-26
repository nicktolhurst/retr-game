(function () {
    "use strict";

    const PhysicsDebugger = (function (ctx) {
        let coral

        coral = "hsla(15 , 100%,  50%, 0.5)";
        // red     = "hsla(0  , 100%,  50%, 0.5)";
        // orange  = "hsla(30 , 100%,  50%, 0.5)";
        // mango   = "hsla(45 , 100%,  50%, 0.5)";
        // yellow  = "hsla(60 , 100%,  50%, 0.5)";
        // umber   = "hsla(60 , 100%,  25%, 0.5)";
        // green   = "hsla(120, 100%,  50%, 0.5)";
        // flora   = "hsla(150, 100%,  50%, 0.5)";
        // aqua    = "hsla(180, 100%,  50%, 0.5)";
        // blue    = "hsla(210, 100%,  50%, 0.5)";
        // violet  = "hsla(300, 100%,  50%, 0.5)";
        // white   = "hsla(0  ,   0%, 100%, 0.5)";
        // gray    = "hsla(0  ,   0%,  50%, 0.5)";

        this.config = {
            on: true,
            fillBody: false,
            lineWidth: 1,
            renderPlayer: true
        };

        this.colours = {
            player: coral
        };

        this.render = {
            allEdges: renderAllEdges,
            leftEdge: renderLeftEdge,
            rightEdge: renderRightEdge,
            topEdge: renderTopEdge,
            bottomEdge: renderBottomEdge,
        }

        this.ctx = ctx;
    });

    PhysicsDebugger.prototype = {
        // configKeys: Object.keys(DEBUG.prototype.config),

        debug: function (obj) {

            if(!this.config.on) { return ;}

            switch (obj.type) {

                case 'player':
                    // this.render.allEdges(obj, this.ctx, this.config.lineWidth, this.colours[obj.type]);
                    this.render.allEdges(obj, this.ctx, this.config.lineWidth, this.colours[obj.type]);
                    break;
            
                default:
                    break;
            }

        }
    }

    function renderAllEdges(obj, ctx, lineWidth, colour) {

        renderLeftEdge(obj, ctx, lineWidth, colour);
        renderRightEdge(obj, ctx, lineWidth, colour);
        renderTopEdge(obj, ctx, lineWidth, colour);
        renderBottomEdge(obj, ctx, lineWidth, colour);
   
    }

    function renderLeftEdge(obj, ctx, lineWidth, colour) {

        ctx.strokeStyle = colour;
        ctx.lineWidth = lineWidth;

        ctx.beginPath();
        ctx.moveTo(obj.pos.x, obj.pos.y);
        ctx.lineTo(obj.pos.x, obj.pos.y + obj.size);
        ctx.stroke();
    };

    function renderRightEdge(obj, ctx, lineWidth, colour) {
        ctx.strokeStyle = colour;
        ctx.lineWidth = lineWidth;

        ctx.beginPath();
        ctx.moveTo(obj.pos.x + obj.size, obj.pos.y);
        ctx.lineTo(obj.pos.x + obj.size, obj.pos.y + obj.size);
        ctx.stroke();
    };

    function renderBottomEdge(obj, ctx, lineWidth, colour) {
        ctx.strokeStyle = colour;
        ctx.lineWidth = lineWidth;

        ctx.beginPath();
        ctx.moveTo(obj.pos.x, obj.pos.y + obj.size);
        ctx.lineTo(obj.pos.x + obj.size, obj.pos.y + obj.size);
        ctx.stroke();
    };

    function renderTopEdge(obj, ctx, lineWidth, colour) {
        ctx.strokeStyle = colour;
        ctx.lineWidth = lineWidth;

        ctx.beginPath();
        ctx.moveTo(obj.pos.x + obj.size, obj.pos.y);
        ctx.lineTo(obj.pos.x, obj.pos.y);
        ctx.stroke();
    };

    GAME.plugins.PhysicsDebugger = PhysicsDebugger;

})();