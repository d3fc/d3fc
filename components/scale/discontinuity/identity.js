(function(d3, fc) {
    'use strict';

    fc.scale.discontinuity.identity = function() {

        var identity = {};

        identity.getDistance = function(startDate, endDate) {
            if (arguments.length === 1) {
                var domain = startDate;
                startDate = domain[0];
                endDate = domain[1];
            }
            return endDate.getTime() - startDate.getTime();
        };

        identity.applyOffset = function(startDate, ticks) {
            return new Date(startDate.getTime() + ticks);
        };

        identity.clampUp = fc.utilities.fn.identity;

        identity.clampDown = fc.utilities.fn.identity;

        identity.copy = function() { return identity; };

        return identity;
    };
}(d3, fc));