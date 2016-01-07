import d3 from 'd3';
import _slidingWindow from './slidingWindow';

export default function() {

    var closeValue = function(d, i) { return d.close; },
        wildersSmoothing = function(values, prevAvg) {
            var result = prevAvg + ((values[values.length - 1] - prevAvg) / values.length);
            return result;
        },
        sum = function(a, b) { return a + b; },
        prevClose,
        prevDownChangesAvg,
        prevUpChangesAvg;

    var slidingWindow = _slidingWindow()
        .windowSize(14)
        .accumulator(function(values) {
            var closes = values.map(closeValue);

            if (!prevClose) {
                prevClose = closes[0];
                return undefined;
            }

            var downChanges = [];
            var upChanges = [];

            closes.forEach(function(close) {
                var downChange = prevClose > close ? prevClose - close : 0;
                var upChange = prevClose < close ? close - prevClose : 0;

                downChanges.push(downChange);
                upChanges.push(upChange);

                prevClose = close;
            });

            var downChangesAvg = prevDownChangesAvg ? wildersSmoothing(downChanges, prevDownChangesAvg) :
                downChanges.reduce(sum) / closes.length;

            var upChangesAvg = prevUpChangesAvg ? wildersSmoothing(upChanges, prevUpChangesAvg) :
                upChanges.reduce(sum) / closes.length;

            prevDownChangesAvg = downChangesAvg;
            prevUpChangesAvg = upChangesAvg;

            var rs = upChangesAvg / downChangesAvg;
            return 100 - (100 / (1 + rs));
        });

    var rsi = function(data) {
        return slidingWindow(data);
    };

    rsi.closeValue = function(x) {
        if (!arguments.length) {
            return closeValue;
        }
        closeValue = x;
        return rsi;
    };

    d3.rebind(rsi, slidingWindow, 'windowSize');

    return rsi;
}
