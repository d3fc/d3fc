(function(d3, fc) {
    'use strict';

    fc.indicators.algorithms.bollingerBands = function() {

        var bollingerAlgorithm = fc.indicators.algorithms.calculators.bollingerBands()
            .value(function(d) { return d.close; });

        var merge = function(datum, boll) {
                datum.upper = boll.upper;
                datum.lower = boll.lower;
                datum.average = boll.average;
            };

        var bollingerBands = function(data) {
            var algorithm = fc.indicators.algorithms.merge()
                .algorithm(bollingerAlgorithm)
                .merge(merge);

            algorithm(data);
        };

        bollingerBands.merge = function(x) {
            if (!arguments.length) {
                return merge;
            }
            merge = x;
            return bollingerBands;
        };

        d3.rebind(bollingerBands, bollingerAlgorithm, 'windowSize', 'value', 'multiplier');

        return bollingerBands;
    };
}(d3, fc));
