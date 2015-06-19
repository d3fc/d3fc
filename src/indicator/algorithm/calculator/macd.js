(function(d3, fc) {
    'use strict';

    fc.indicator.algorithm.calculator.macd = function() {

        var value = fc.util.fn.identity;

        var fastEMA = fc.indicator.algorithm.calculator.exponentialMovingAverage()
            .windowSize(12);
        var slowEMA = fc.indicator.algorithm.calculator.exponentialMovingAverage()
            .windowSize(29);
        var signalEMA = fc.indicator.algorithm.calculator.exponentialMovingAverage()
            .windowSize(9);
        var adaptedSignalEMA = fc.indicator.algorithm.calculator.undefinedInputAdapter()
            .algorithm(signalEMA);

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

            var averageDiff = adaptedSignalEMA(diff);

            var macd = d3.zip(diff, averageDiff)
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

        fc.util.rebind(macd, fastEMA, {
            fastPeriod: 'windowSize'
        });

        fc.util.rebind(macd, slowEMA, {
            slowPeriod: 'windowSize'
        });

        fc.util.rebind(macd, signalEMA, {
            signalPeriod: 'windowSize'
        });

        return macd;
    };
}(d3, fc));
