(function(d3, fc) {
    'use strict';

    fc.indicators.algorithms.macd = function() {

        var macdAlgorithm = fc.indicators.algorithms.calculators.macd()
            .value(function(d) { return d.close; });

        var mergedAlgorithm = fc.indicators.algorithms.merge()
                .algorithm(macdAlgorithm)
                .merge(function(datum, macd) { datum.macd = macd; });

        var macd = function(data) {
            return mergedAlgorithm(data);
        };

        d3.rebind(macd, mergedAlgorithm, 'merge');

        return macd;
    };
}(d3, fc));
