(function(d3, fc) {
    'use strict';

    fc.indicators.algorithms.exponentialMovingAverage = function() {

        var days = 9,
            value = fc.utilities.fn.identity;

        function undefinedArrayOfLength(length) {
            return Array.apply(undefined, new Array(length));
        }

        var exponentialMovingAverage = function(data) {
            if (data.length < days) {
                return undefinedArrayOfLength(data.length);
            }
            var ema = undefinedArrayOfLength(days - 1);
            var previous = d3.mean(data.slice(0, days).map(value));
            ema.push(previous);

            var alpha = 2 / (days + 1);
            for (var index = days; index < data.length; index++) {
                var nextValue = value(data[index]) * alpha + (1 - alpha) * previous;
                ema.push(nextValue);
                previous = nextValue;
            }

            return ema;
        };

        exponentialMovingAverage.days = function(x) {
            if (!arguments.length) {
                return days;
            }
            days = x;
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
