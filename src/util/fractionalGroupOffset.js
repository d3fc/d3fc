(function(d3, fc) {
    'use strict';

    // The offset property of the various series takes a function which, a given group, with a given set of groups
    // and an array of X values, returns a suitable offset. This function returns an offset that evenly spaces all given
    // groups, with the available space, where the available space is equal to the smallest distance between
    // neighbouring X values multiplied by the given factor.
    fc.util.fractionalGroupOffset = function(fraction) {

        var groupWidth = fc.util.fractionalBarWidth(fraction);
        var subScale = d3.scale.ordinal();

        return function(group, index, groups, xPixels) {
            var groupSpan = groupWidth(xPixels);

            subScale.domain(groups)
                .rangePoints([-groupSpan / 2, groupSpan / 2]);

            return subScale(group);
        };
    };
}(d3, fc));
