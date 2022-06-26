const { FRAME_DELAY } = require('./constants');

const Animation = function (frame_set = 0, delay) {

    this.count = 0;                 // Counts the number of game cycles since the last frame change.
    this.delay = delay;             // The number of game cycles to wait until the next frame change.
    this.frame = 0;                 // The value in the sprite sheet of the sprite image / tile to display.
    this.frame_index = 0;           // The frame's index in the current animation frame set.
    this.frame_set = frame_set;     // The current animation frame set that holds sprite tile values.
    this.lock = false;              // The current animation frame set that holds sprite tile values.

};

Animation.prototype = {

    change: function (frame_set, delay = FRAME_DELAY) {

        if (this.frame_set != frame_set && !this.lock) {    // If the frame set is different and not locked.

            this.lock = true;
            this.count = 0;                                 // Reset the count.
            this.delay = delay;                             // Set the delay.
            this.frame_index = 0;                           // Start at the first frame in the new frame set.
            this.frame_set = frame_set;                     // Set the new frame set.
            this.frame = this.frame_set[this.frame_index];  // Set the new frame value.

        }
    },

    /* Call this on each game cycle. */
    update: function () {

        this.count++;

        if (this.count >= this.delay) {

            this.count = 0;
            this.frame_index = (this.frame_index == this.frame_set.length - 1) ? 0 : this.frame_index + 1;
            this.frame = this.frame_set[this.frame_index];

        }

        if (this.frame_index == (this.frame_set.length - 1)) {

            this.lock = false;

        }
    }

};

module.exports = { Animation }