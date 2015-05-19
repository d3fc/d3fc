(function(d3, fc) {
    'use strict';

    fc.indicators.algorithms.macd = function() {

        var fastEMA = fc.indicators.algorithms.exponentialMovingAverage()
            .windowSize(12);
        var slowEMA = fc.indicators.algorithms.exponentialMovingAverage()
            .windowSize(29);
        var average = fc.indicators.algorithms.exponentialMovingAverage()
            .windowSize(9);
        var avg = fc.indicators.algorithms.undefinedInputAdapter()
            .algorithm(average);

        var macd = function(data) {
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
                        divergence: d[0] - d[1]
                    };
                });

            return macd;
        };

        return macd;
    };
}(d3, fc));
