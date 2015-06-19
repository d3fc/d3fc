(function(d3, fc) {
    'use strict';

    fc.indicator.algorithm.macd = function() {

        var macdAlgorithm = fc.indicator.algorithm.calculator.macd()
            .value(function(d) { return d.close; });

        var mergedAlgorithm = fc.indicator.algorithm.merge()
                .algorithm(macdAlgorithm)
                .merge(function(datum, macd) { datum.macd = macd; });

        var macd = function(data) {
            return mergedAlgorithm(data);
        };

        d3.rebind(macd, mergedAlgorithm, 'merge');
        d3.rebind(macd, macdAlgorithm, 'fastPeriod', 'slowPeriod', 'signalPeriod', 'value');

        return macd;
    };
}(d3, fc));
