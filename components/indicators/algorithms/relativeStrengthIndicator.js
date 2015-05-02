(function(d3, fc) {
    'use strict';

    fc.indicators.algorithms.relativeStrengthIndicator = function() {

        var slidingWindow = fc.indicators.algorithms.slidingWindow()
            .windowSize(14)
            .accumulator(function(values) {
                var downCloses = [];
                var upCloses = [];

                for (var i = 0, l = values.length; i < l; i++) {
                    var value = values[i];

                    var openValue = rsi.openValue.value(value);
                    var closeValue = rsi.closeValue.value(value);

                    downCloses.push(openValue > closeValue ? openValue - closeValue : 0);
                    upCloses.push(openValue < closeValue ? closeValue - openValue : 0);
                }

                var downClosesAvg = rsi.averageAccumulator.value(downCloses);
                if (downClosesAvg === 0) {
                    return 100;
                }

                var rs = rsi.averageAccumulator.value(upCloses) / downClosesAvg;
                return 100 - (100 / (1 + rs));
            });

        var rsi = function(data) {
            return slidingWindow(data);
        };

        rsi.openValue = fc.utilities.property(function(d) { return d.open; });
        rsi.closeValue = fc.utilities.property(function(d) { return d.close; });
        rsi.averageAccumulator = fc.utilities.property(function(values) {
            var alpha = 1 / values.length;
            var result = values[0];
            for (var i = 1, l = values.length; i < l; i++) {
                result = alpha * values[i] + (1 - alpha) * result;
            }
            return result;
        });

        d3.rebind(rsi, slidingWindow, 'windowSize', 'outputValue');

        return rsi;
    };
}(d3, fc));
