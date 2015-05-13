(function(d3, fc) {
    'use strict';

    fc.indicators.algorithms.bollingerBands = function() {

        var multiplier = d3.functor(2);

        var slidingWindow = fc.indicators.algorithms.slidingWindow()
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
            multiplier = d3.functor(x);
            return bollingerBands;
        };

        d3.rebind(bollingerBands, slidingWindow, 'windowSize', 'inputValue', 'outputValue');

        return bollingerBands;
    };
}(d3, fc));
