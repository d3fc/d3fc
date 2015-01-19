(function(d3, fc) {
    'use strict';

    fc.math.slidingWindow = function() {

        var slidingWindow = function(data) {
            var size = slidingWindow.windowSize.value.apply(this, arguments);
            var accumulator = slidingWindow.accumulator.value;
            var inputValue = slidingWindow.inputValue.value;
            var outputValue = slidingWindow.outputValue.value;

            var windowData = data.slice(0, size).map(inputValue);
            return data.slice(size - 1, data.length)
                .map(function(d, i) {
                    if (i > 0) {
                        // Treat windowData as FIFO rolling buffer
                        windowData.shift();
                        windowData.push(inputValue(d));
                    }
                    var result = accumulator(windowData);
                    return outputValue(d, result);
                });
        };

        slidingWindow.windowSize = fc.utilities.functorProperty(10);
        slidingWindow.accumulator = fc.utilities.property(fc.utilities.fn.noop);
        slidingWindow.inputValue = fc.utilities.property(fc.utilities.fn.identity);
        slidingWindow.outputValue = fc.utilities.property(function(obj, value) { return value; });

        return slidingWindow;
    };
}(d3, fc));
