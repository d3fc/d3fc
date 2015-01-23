(function(d3, fc) {
    'use strict';

    fc.scale.discontinuity.identity = function() {

        function getDistance(startDate, endDate) {
            if (arguments.length === 1) {
                var domain = startDate;
                startDate = domain[0];
                endDate = domain[1];
            }
            return endDate.getTime() - startDate.getTime();
        }

        function applyOffset(startDate, ticks) {
            return new Date(startDate.getTime() + ticks);
        }

        function noop(date) { return date; }

        return {
            applyOffset: applyOffset,
            getDistance: getDistance,
            clampUp: noop,
            clampDown: noop
        };
    };
}(d3, fc));