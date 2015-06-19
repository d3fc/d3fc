(function(d3, fc) {
    'use strict';

    fc.indicator.algorithm.bollingerBands = function() {

        var bollingerAlgorithm = fc.indicator.algorithm.calculator.bollingerBands()
            .value(function(d) { return d.close; });

        var mergedAlgorithm = fc.indicator.algorithm.merge()
                .algorithm(bollingerAlgorithm)
                .merge(function(datum, boll) { datum.bollingerBands = boll; });

        var bollingerBands = function(data) {
            return mergedAlgorithm(data);
        };

        bollingerBands.root = function(d) {
            return d.bollingerBands;
        };

        d3.rebind(bollingerBands, mergedAlgorithm, 'merge');
        d3.rebind(bollingerBands, bollingerAlgorithm, 'windowSize', 'value', 'multiplier');

        return bollingerBands;
    };
}(d3, fc));
