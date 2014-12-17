(function(d3, fc) {
    'use strict';

    fc.utilities.seriesElementWidth = function(timeInterval, units) {
        // Given a time scale, return the width of a number of timeInterval units.
        return function(scale) {
            var point, left, right, difference;

            point = scale.domain()[0];
            left = timeInterval.floor(point);
            right = timeInterval.ceil(point);

            if (left.getTime() === right.getTime()) {
                right = timeInterval.offset(point, 1);
            }
            difference = Math.abs(scale(left) - scale(right));
            return difference * units;
        };
    };
}(d3, fc));
