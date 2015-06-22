(function(d3, fc) {
    'use strict';

    fc.indicator.algorithm.calculator.exponentialMovingAverage = function() {

        var windowSize = 9,
            value = fc.util.fn.identity;

        var exponentialMovingAverage = function(data) {

            var alpha = 2 / (windowSize + 1);
            var previous;
            var initialAccumulator = 0;

            return data.map(function(d, i) {
                    if (i < windowSize - 1) {
                        initialAccumulator += value(d, i);
                        return undefined;
                    } else if (i === windowSize - 1) {
                        initialAccumulator += value(d, i);
                        var initialValue = initialAccumulator / windowSize;
                        previous = initialValue;
                        return initialValue;
                    } else {
                        var nextValue = value(d, i) * alpha + (1 - alpha) * previous;
                        previous = nextValue;
                        return nextValue;
                    }
                });
        };

        exponentialMovingAverage.windowSize = function(x) {
            if (!arguments.length) {
                return windowSize;
            }
            windowSize = x;
            return exponentialMovingAverage;
        };

        exponentialMovingAverage.value = function(x) {
            if (!arguments.length) {
                return value;
            }
            value = x;
            return exponentialMovingAverage;
        };

        return exponentialMovingAverage;
    };
}(d3, fc));
