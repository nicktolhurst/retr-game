module.exports = {

    // LAND - This tile blocks movement through the top, left and right.
    0: function (object, row, column, y_offset, size) {

        if (this.topCollision(object, row, y_offset, size)) { return; };

    },

    // DIRT - This tile will block from all sides.
    1: function (object, row, column, y_offset, size) {

        if (this.topCollision(object, row, y_offset, size)) { return; };
        if (this.rightCollision(object, column, size)) { return; };
        this.leftCollision(object, column, size);

    },

    // RIGHT WALL - This tile will block from the left.
    2: function (object, row, column, y_offset, size) {

        if (this.rightCollision(object, column, size)) { return; };


    },

    // WATER - This tile will do something crazy.
    3: function (object, row, column, y_offset, size) { },

    // CLOUD - This tile will have no colissions.
    4: function (object, row, column, y_offset, size) { },

    // SKY - This tile will have no colissions.
    5: function (object, row, column, y_offset, size) { },

    // LEFT WALL - This tile will block from the right.
    6: function (object, row, column, y_offset, size) {

        if (this.leftCollision(object, column, size)) { return; };

    },

    // LEDGE - This tile only blocks movement through the top.
    7: function (object, row, column, y_offset, size) {

        if (this.topCollision(object, row, (size - y_offset), size)) { return; };

    },

    topCollision(object, row, y_offset, size) {

        if (object.vel.y > 0) {

            var top = row * size;

            if (object.pos.y + y_offset > top && object.pre.y + y_offset <= top) {

                object.grounded = true;
                object.vel.y = 0;
                object.pre.y = object.pos.y = top - y_offset - 0.1;

                return true;

            }

        }

        return false;

    },


    leftCollision(object, column, size) {

        if (object.vel.x > 0) {

            var left = column * size;

            if (object.pos.x + size * 0.5 > left && object.pre.x + size * 0.5 <= left) {

                object.vel.x = 0;
                object.pos.y = object.pre.y
                object.pos.x = object.pre.x = left - size * 0.5 - 0.01;
                return true;

            }

        }

        return false;
    },

    rightCollision(object, column, row, size) {

        if (object.vel.x < 0) {

            let right = (column + 1) * size;
            let bottom = (row + 1) * size;

            if (object.pos.x + size * 0.5 < right && object.pre.x + size * 0.5 >= right) {

                object.pre.x = object.pos.x = right - size * 0.5;

                return true;

            }

        }

        return false;

    },
}