(function(d3, fc) {
    'use strict';

    fc.util.scale = {
        // ordinal axes have a rangeExtent function, this adds any padding that
        // was applied to the range. This functions returns the rangeExtent
        // if present, or range otherwise
        range: function(scale) {
            return fc.util.scale.isOrdinal(scale) ? scale.rangeExtent() : scale.range();
        },

        isOrdinal: function(scale) {
            return scale.rangeExtent;
        }
    };
}(d3, fc));
