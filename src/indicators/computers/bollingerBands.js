(function(d3, fc) {
    'use strict';

    fc.indicators.computers.bollingerBands = function() {

        var bollingerAlgorithm = fc.indicators.algorithms.bollingerBands()
            .value(function(d) { return d.close; });

        var merge = function(datum, boll) {
                datum.upper = boll.upper;
                datum.lower = boll.lower;
                datum.average = boll.average;
            };

        var bollingerBands = function(data) {
            var computer = fc.indicators.computers.merge()
                .algorithm(bollingerAlgorithm)
                .merge(merge);

            computer(data);
        };

        d3.rebind(bollingerBands, bollingerAlgorithm, 'windowSize', 'value', 'multiplier');

        return bollingerBands;
    };
}(d3, fc));
