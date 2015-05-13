(function(d3, fc) {
    'use strict';

    fc.indicators.algorithms.slidingWindow = function() {

        var windowSize = d3.functor(10),
            accumulator = fc.utilities.fn.noop,
            inputValue = fc.utilities.fn.identity,
            outputValue = function(obj, value) { return value; };

        var slidingWindow = function(data) {
            var size = windowSize.apply(this, arguments);
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

        slidingWindow.windowSize = function(x) {
            if (!arguments.length) {
                return windowSize;
            }
            windowSize = d3.functor(x);
            return slidingWindow;
        };
        slidingWindow.accumulator = function(x) {
            if (!arguments.length) {
                return accumulator;
            }
            accumulator = x;
            return slidingWindow;
        };
        slidingWindow.inputValue = function(x) {
            if (!arguments.length) {
                return inputValue;
            }
            inputValue = x;
            return slidingWindow;
        };
        slidingWindow.outputValue = function(x) {
            if (!arguments.length) {
                return outputValue;
            }
            outputValue = x;
            return slidingWindow;
        };

        return slidingWindow;
    };
}(d3, fc));
