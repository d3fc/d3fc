(function(d3, fc) {
    'use strict';

    fc.indicators.algorithms.relativeStrengthIndex = function() {

        var rsi = fc.indicators.algorithms.calculators.relativeStrengthIndex();

        var merge = function(datum, rsi) { datum.rsi = rsi; };

        var relativeStrengthIndex = function(data) {
            var algorithm = fc.indicators.algorithms.merge()
                .algorithm(rsi)
                .merge(merge);

            algorithm(data);
        };

        relativeStrengthIndex.merge = function(x) {
            if (!arguments.length) {
                return merge;
            }
            merge = x;
            return relativeStrengthIndex;
        };

        d3.rebind(relativeStrengthIndex, rsi, 'windowSize', 'open', 'close');

        return relativeStrengthIndex;
    };
}(d3, fc));
