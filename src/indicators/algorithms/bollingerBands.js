(function(d3, fc) {
    'use strict';

    fc.indicators.algorithms.bollingerBands = function() {

        var bollingerAlgorithm = fc.indicators.algorithms.calculators.bollingerBands()
            .value(function(d) { return d.close; });

        var mergedAlgorithm = fc.indicators.algorithms.merge()
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
