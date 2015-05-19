(function(d3, fc) {
    'use strict';

    fc.indicators.algorithms.calculators.macd = function() {

        var value = fc.utilities.fn.identity;

        var fastEMA = fc.indicators.algorithms.calculators.exponentialMovingAverage()
            .windowSize(12);
        var slowEMA = fc.indicators.algorithms.calculators.exponentialMovingAverage()
            .windowSize(29);
        var average = fc.indicators.algorithms.calculators.exponentialMovingAverage()
            .windowSize(9);
        var avg = fc.indicators.algorithms.calculators.undefinedInputAdapter()
            .algorithm(average);

        var macd = function(data) {

            fastEMA.value(value);
            slowEMA.value(value);

            var diff = d3.zip(fastEMA(data), slowEMA(data))
                .map(function(d) {
                    if (d[0] !== undefined && d[1] !== undefined) {
                        return d[0] - d[1];
                    } else {
                        return undefined;
                    }
                });

            var average = avg(diff);

            var macd = d3.zip(diff, average)
                .map(function(d) {
                    return {
                        macd: d[0],
                        signal: d[1],
                        divergence: d[0] !== undefined && d[1] !== undefined ? d[0] - d[1] : undefined
                    };
                });

            return macd;
        };

        macd.value = function(x) {
            if (!arguments.length) {
                return value;
            }
            value = x;
            return macd;
        };

        return macd;
    };
}(d3, fc));
