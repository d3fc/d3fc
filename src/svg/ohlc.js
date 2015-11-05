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
        width = d3.functor(3);

    var ohlc = function(data) {

        return data.map(function(d, i) {
            var xValue = x(d, i),
                yOpen = open(d, i),
                yHigh = high(d, i),
                yLow = low(d, i),
                yClose = close(d, i),
                halfWidth = width(d, i) / 2;

            var moveToLow = 'M' + xValue + ',' + yLow,
                verticalToHigh = 'V' + yHigh,
                openTick = 'M' + xValue + ',' + yOpen + 'h' + (-halfWidth),
                closeTick = 'M' + xValue + ',' + yClose + 'h' + halfWidth;
            return moveToLow + verticalToHigh + openTick + closeTick;
        })
        .join('');
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

    return ohlc;

}
