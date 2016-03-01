import d3 from 'd3';

// Renders a candlestick as an SVG path based on the given array of datapoints. Each
// candlestick has a fixed width, whilst the x, open, high, low and close positions are
// obtained from each point via the supplied accessor functions.
export default function(context) {

    var x = function(d, i) { return d.date; },
        open = function(d, i) { return d.open; },
        high = function(d, i) { return d.high; },
        low = function(d, i) { return d.low; },
        close = function(d, i) { return d.close; },
        width = d3.functor(3);

    var candlestick = function(data) {
        var path = context();

        data.forEach(function(d, i) {
            var xValue = x(d, i),
                yOpen = open(d, i),
                yHigh = high(d, i),
                yLow = low(d, i),
                yClose = close(d, i),
                barWidth = width(d, i),
                halfBarWidth = barWidth / 2;

            // Body
            path.rect(xValue - halfBarWidth, yOpen, barWidth, yClose - yOpen);
            // High wick
            // // Move to the max price of close or open; draw the high wick
            // N.B. Math.min() is used as we're dealing with pixel values,
            // the lower the pixel value, the higher the price!
            path.moveTo(xValue, Math.min(yClose, yOpen));
            path.lineTo(xValue, yHigh);
            // Low wick
            // // Move to the min price of close or open; draw the low wick
            // N.B. Math.max() is used as we're dealing with pixel values,
            // the higher the pixel value, the lower the price!
            path.moveTo(xValue, Math.max(yClose, yOpen));
            path.lineTo(xValue, yLow);
        });

        return path.toString();
    };

    candlestick.x = function(_x) {
        if (!arguments.length) {
            return x;
        }
        x = d3.functor(_x);
        return candlestick;
    };
    candlestick.open = function(_x) {
        if (!arguments.length) {
            return open;
        }
        open = d3.functor(_x);
        return candlestick;
    };
    candlestick.high = function(_x) {
        if (!arguments.length) {
            return high;
        }
        high = d3.functor(_x);
        return candlestick;
    };
    candlestick.low = function(_x) {
        if (!arguments.length) {
            return low;
        }
        low = d3.functor(_x);
        return candlestick;
    };
    candlestick.close = function(_x) {
        if (!arguments.length) {
            return close;
        }
        close = d3.functor(_x);
        return candlestick;
    };
    candlestick.width = function(_x) {
        if (!arguments.length) {
            return width;
        }
        width = d3.functor(_x);
        return candlestick;
    };

    return candlestick;

}
