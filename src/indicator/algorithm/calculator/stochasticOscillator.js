import d3 from 'd3';
import slidingWindow from './slidingWindow';
import {includeMap, rebindAll} from 'd3fc-rebind';

export default function() {

    var closeValue = function(d, i) { return d.close; },
        highValue = function(d, i) { return d.high; },
        lowValue = function(d, i) { return d.low; };

    var kWindow = slidingWindow()
        .windowSize(5)
        .accumulator(function(values) {
            var maxHigh = d3.max(values, highValue);
            var minLow = d3.min(values, lowValue);
            return 100 * (closeValue(values[values.length - 1]) - minLow) / (maxHigh - minLow);
        });

    var dWindow = slidingWindow()
        .windowSize(3)
        .accumulator(function(values) {
            if (values[0] === undefined) {
                return undefined;
            }
            return d3.mean(values);
        });

    var stochastic = function(data) {
        var kValues = kWindow(data);
        var dValues = dWindow(kValues);
        return kValues.map(function(k, i) {
            var d = dValues[i];
            return { k: k, d: d };
        });
    };

    stochastic.closeValue = function(x) {
        if (!arguments.length) {
            return closeValue;
        }
        closeValue = x;
        return stochastic;
    };
    stochastic.highValue = function(x) {
        if (!arguments.length) {
            return highValue;
        }
        highValue = x;
        return stochastic;
    };
    stochastic.lowValue = function(x) {
        if (!arguments.length) {
            return highValue;
        }
        lowValue = x;
        return stochastic;
    };

    rebindAll(stochastic, kWindow, includeMap({'windowSize': 'kWindowSize'}));
    rebindAll(stochastic, dWindow, includeMap({'windowSize': 'dWindowSize'}));

    return stochastic;
}
