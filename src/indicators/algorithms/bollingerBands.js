(function(d3, fc) {
    'use strict';

    fc.indicators.algorithms.bollingerBands = function() {

        var slidingWindow = fc.indicators.algorithms.slidingWindow()
            .accumulator(function(values) {
                var avg = d3.mean(values);
                var stdDev = d3.deviation(values);
                var multiplier = bollingerBands.multiplier.value.apply(this, arguments);
                return {
                    upper: avg + multiplier * stdDev,
                    average: avg,
                    lower: avg - multiplier * stdDev
                };
            });

        var bollingerBands = function(data) {
            return slidingWindow(data);
        };

        bollingerBands.multiplier = fc.utilities.functorProperty(2);

        d3.rebind(bollingerBands, slidingWindow, 'windowSize', 'inputValue', 'outputValue');

        return bollingerBands;
    };
}(d3, fc));
