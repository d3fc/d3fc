(function(d3, fc) {
    'use strict';

    fc.scale.discontinuity.identity = function() {

        var identity = {};

        identity.distance = function(startDate, endDate) {
            return endDate.getTime() - startDate.getTime();
        };

        identity.offset = function(startDate, ms) {
            return new Date(startDate.getTime() + ms);
        };

        identity.clampUp = fc.utilities.fn.identity;

        identity.clampDown = fc.utilities.fn.identity;

        identity.copy = function() { return identity; };

        return identity;
    };
}(d3, fc));