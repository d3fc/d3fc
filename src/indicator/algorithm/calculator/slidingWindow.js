import d3 from 'd3';
import {identity, noop} from '../../../util/fn';

export default function() {

    var undefinedValue = d3.functor(undefined),
        windowSize = d3.functor(10),
        accumulator = noop,
        value = identity;

    var slidingWindow = function(data) {
        var size = windowSize.apply(this, arguments);
        var windowData = data.slice(0, size).map(value);
        return data.map(function(d, i) {
            if (i < size - 1) {
                return undefinedValue(d, i);
            }
            if (i >= size) {
                // Treat windowData as FIFO rolling buffer
                windowData.shift();
                windowData.push(value(d, i));
            }
            return accumulator(windowData);
        });
    };

    slidingWindow.undefinedValue = function(x) {
        if (!arguments.length) {
            return undefinedValue;
        }
        undefinedValue = d3.functor(x);
        return slidingWindow;
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
    slidingWindow.value = function(x) {
        if (!arguments.length) {
            return value;
        }
        value = x;
        return slidingWindow;
    };

    return slidingWindow;
}
