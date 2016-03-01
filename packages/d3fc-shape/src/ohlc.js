
import d3 from 'd3';

// Renders an OHLC as an SVG path based on the given array of datapoints. Each
// OHLC has a fixed width, whilst the x, open, high, low and close positions are
// obtained from each point via the supplied accessor functions.
export default function() {

    var x = function(d, i) { return d.date; },
        open = function(d, i) { return d.open; },
        high = function(d, i) { return d.high; },
        low = function(d, i) { return d.low; },
        close = function(d, i) { return d.close; },
        orient = 'vertical',
        width = d3.functor(3);

    var ohlc = function(context, data) {

        data.forEach(function(d, i) {
            var xValue = x(d, i),
                yOpen = open(d, i),
                yHigh = high(d, i),
                yLow = low(d, i),
                yClose = close(d, i),
                halfWidth = width(d, i) / 2;

            if (orient === 'vertical') {
                context.moveTo(xValue, yLow);
                context.lineTo(xValue, yHigh);

                context.moveTo(xValue, yOpen);
                context.lineTo(xValue - halfWidth, yOpen);
                context.moveTo(xValue, yClose);
                context.lineTo(xValue + halfWidth, yClose);
            } else {
                context.moveTo(yLow, xValue);
                context.lineTo(yHigh, xValue);

                context.moveTo(yOpen, xValue);
                context.lineTo(yOpen, xValue + halfWidth);
                context.moveTo(yClose, xValue);
                context.lineTo(yClose, xValue - halfWidth);
            }
        });

        return context.toString();
    };

    ohlc.x = function(_x) {
        if (!arguments.length) {
            return x;
        }
        x = d3.functor(_x);
        return ohlc;
    };
    ohlc.open = function(_x) {
        if (!arguments.length) {
            return open;
        }
        open = d3.functor(_x);
        return ohlc;
    };
    ohlc.high = function(_x) {
        if (!arguments.length) {
            return high;
        }
        high = d3.functor(_x);
        return ohlc;
    };
    ohlc.low = function(_x) {
        if (!arguments.length) {
            return low;
        }
        low = d3.functor(_x);
        return ohlc;
    };
    ohlc.close = function(_x) {
        if (!arguments.length) {
            return close;
        }
        close = d3.functor(_x);
        return ohlc;
    };
    ohlc.width = function(_x) {
        if (!arguments.length) {
            return width;
        }
        width = d3.functor(_x);
        return ohlc;
    };
    ohlc.orient = function(_x) {
        if (!arguments.length) {
            return orient;
        }
        orient = d3.functor(_x);
        return ohlc;
    };

    return ohlc;

}
