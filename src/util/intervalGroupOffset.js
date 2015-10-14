(function(d3, fc) {
    'use strict';

    // The offset property of the various series takes a function which, a given group, with a given set of groups
    // and an array of X values, returns a suitable offset. This function returns an offset which offsets all groups
    // evenly by the given (interval) centred around 0.
    fc.util.intervalGroupOffset = function(interval) {
        var subScale = d3.scale.ordinal();

        return function(group, index, groups) {
            var groupSpan = (groups.length - 1) * interval;

            subScale.domain(groups)
                .rangePoints([-groupSpan / 2, groupSpan / 2]);

            return subScale(group);
        };
    };
}(d3, fc));
