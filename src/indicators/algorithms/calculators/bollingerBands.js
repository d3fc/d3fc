(function(d3, fc) {
    'use strict';

    fc.indicators.algorithms.calculators.bollingerBands = function() {

        var multiplier = 2;

        var slidingWindow = fc.indicators.algorithms.calculators.slidingWindow()
            .undefinedValue({
                upper: undefined,
                average: undefined,
                lower: undefined
            })
            .accumulator(function(values) {
                var avg = d3.mean(values);
                var stdDev = d3.deviation(values);
                var multiplierValue = multiplier.apply(this, arguments);
                return {
                    upper: avg + multiplierValue * stdDev,
                    average: avg,
                    lower: avg - multiplierValue * stdDev
                };
            });

        var bollingerBands = function(data) {
            return slidingWindow(data);
        };

        bollingerBands.multiplier = function(x) {
            if (!arguments.length) {
                return multiplier;
            }
            multiplier = x;
            return bollingerBands;
        };

        d3.rebind(bollingerBands, slidingWindow, 'windowSize', 'value');

        return bollingerBands;
    };
}(d3, fc));
