(function(d3, fc) {
    'use strict';

    fc.indicators.algorithms.relativeStrengthIndicator = function() {

        var open = function(d, i) { return d.open; },
            close = function(d, i) { return d.close; },
            averageAccumulator = function(values) {
                var alpha = 1 / values.length;
                var result = values[0];
                for (var i = 1, l = values.length; i < l; i++) {
                    result = alpha * values[i] + (1 - alpha) * result;
                }
                return result;
            };

        var slidingWindow = fc.indicators.algorithms.slidingWindow()
            .windowSize(14)
            .accumulator(function(values) {
                var downCloses = [];
                var upCloses = [];

                for (var i = 0, l = values.length; i < l; i++) {
                    var value = values[i];

                    var openValue = open(value);
                    var closeValue = close(value);

                    downCloses.push(openValue > closeValue ? openValue - closeValue : 0);
                    upCloses.push(openValue < closeValue ? closeValue - openValue : 0);
                }

                var downClosesAvg = averageAccumulator(downCloses);
                if (downClosesAvg === 0) {
                    return 100;
                }

                var rs = averageAccumulator(upCloses) / downClosesAvg;
                return 100 - (100 / (1 + rs));
            });

        var rsi = function(data) {
            return slidingWindow(data);
        };

        rsi.open = function(x) {
            if (!arguments.length) {
                return open;
            }
            open = x;
            return rsi;
        };
        rsi.close = function(x) {
            if (!arguments.length) {
                return close;
            }
            close = x;
            return rsi;
        };
        rsi.averageAccumulator = function(x) {
            if (!arguments.length) {
                return averageAccumulator;
            }
            averageAccumulator = x;
            return rsi;
        };

        d3.rebind(rsi, slidingWindow, 'windowSize');

        return rsi;
    };
}(d3, fc));
