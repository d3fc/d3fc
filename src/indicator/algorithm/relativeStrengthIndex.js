(function(d3, fc) {
    'use strict';

    fc.indicator.algorithm.relativeStrengthIndex = function() {

        var rsi = fc.indicator.algorithm.calculator.relativeStrengthIndex();

        var mergedAlgorithm = fc.indicator.algorithm.merge()
                .algorithm(rsi)
                .merge(function(datum, rsi) { datum.rsi = rsi; });

        var relativeStrengthIndex = function(data) {
            return mergedAlgorithm(data);
        };

        d3.rebind(relativeStrengthIndex, mergedAlgorithm, 'merge');
        d3.rebind(relativeStrengthIndex, rsi, 'windowSize', 'openValue', 'closeValue');

        return relativeStrengthIndex;
    };
}(d3, fc));
