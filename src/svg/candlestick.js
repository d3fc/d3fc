import d3 from 'd3';

// Renders a candlestick as an SVG path based on the given array of datapoints. Each
// candlestick has a fixed width, whilst the x, open, high, low and close positions are
// obtained from each point via the supplied accessor functions.
export default function() {

    var x = function(d, i) { return d.date; },
        open = function(d, i) { return d.open; },
        high = function(d, i) { return d.high; },
        low = function(d, i) { return d.low; },
        close = function(d, i) { return d.close; },
        width = d3.functor(3);

    var candlestick = function(data) {

        return data.map(function(d, i) {
            var xValue = x(d, i),
                yOpen = open(d, i),
                yHigh = high(d, i),
                yLow = low(d, i),
                yClose = close(d, i),
                barWidth = width(d, i);

            // Move to the opening price
            var body = 'M' + (xValue - barWidth / 2) + ',' + yOpen +
                // Draw the width
                'h' + barWidth +
                // Draw to the closing price (vertically)
                'V' + yClose +
                // Draw the width
                'h' + -barWidth +
                // Move back to the opening price
                'V' + yOpen +
                // Close the path
                'z';

            // Move to the max price of close or open; draw the high wick
            // N.B. Math.min() is used as we're dealing with pixel values,
            // the lower the pixel value, the higher the price!
            var highWick = 'M' + xValue + ',' + Math.min(yClose, yOpen) +
                'V' + yHigh;

            // Move to the min price of close or open; draw the low wick
            // N.B. Math.max() is used as we're dealing with pixel values,
            // the higher the pixel value, the lower the price!
            var lowWick = 'M' + xValue + ',' + Math.max(yClose, yOpen) +
                'V' + yLow;

            return body + highWick + lowWick;
        })
        .join('');
    };

    candlestick.x = function(_x) {
        if (!arguments.length) {
            return x;
        }
        x = _x;
        return candlestick;
    };
    candlestick.open = function(x) {
        if (!arguments.length) {
            return open;
        }
        open = x;
        return candlestick;
    };
    candlestick.high = function(x) {
        if (!arguments.length) {
            return high;
        }
        high = x;
        return candlestick;
    };
    candlestick.low = function(x) {
        if (!arguments.length) {
            return low;
        }
        low = x;
        return candlestick;
    };
    candlestick.close = function(x) {
        if (!arguments.length) {
            return close;
        }
        close = x;
        return candlestick;
    };
    candlestick.width = function(x) {
        if (!arguments.length) {
            return width;
        }
        width = d3.functor(x);
        return candlestick;
    };

    return candlestick;

}
