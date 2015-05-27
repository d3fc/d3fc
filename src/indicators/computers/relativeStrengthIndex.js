(function(d3, fc) {
    'use strict';

    fc.indicators.computers.relativeStrengthIndex = function() {

        var rsi = fc.indicators.algorithms.relativeStrengthIndex();

        var merge = function(datum, rsi) { datum.rsi = rsi; };

        var relativeStrengthIndex = function(data) {
            var computer = fc.indicators.computers.merge()
                .algorithm(rsi)
                .merge(merge);

            computer(data);
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
