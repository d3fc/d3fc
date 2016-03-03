import functor from './functor';

// Renders a candlestick as an SVG path based on the given array of datapoints. Each
// candlestick has a fixed width, whilst the x, open, high, low and close positions are
// obtained from each point via the supplied accessor functions.
export default (context) => {

    let x       = (d) => d.date;
    let open    = (d) => d.open;
    let high    = (d) => d.high;
    let low     = (d) => d.low;
    let close   = (d) => d.close;
    let width   = functor(3);

    const candlestick = (data) => {
        const path = context();

        data.forEach((d, i) => {
            const xValue        = x(d, i);
            const yOpen         = open(d, i);
            const yHigh         = high(d, i);
            const yLow          = low(d, i);
            const yClose        = close(d, i);
            const barWidth      = width(d, i);
            const halfBarWidth  = barWidth / 2;

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

    candlestick.x = (_x) => {
        if (!arguments.length) {
            return x;
        }
        x = functor(_x);
        return candlestick;
    };
    candlestick.open = (_x) => {
        if (!arguments.length) {
            return open;
        }
        open = functor(_x);
        return candlestick;
    };
    candlestick.high = (_x) => {
        if (!arguments.length) {
            return high;
        }
        high = functor(_x);
        return candlestick;
    };
    candlestick.low = (_x) => {
        if (!arguments.length) {
            return low;
        }
        low = functor(_x);
        return candlestick;
    };
    candlestick.close = (_x) => {
        if (!arguments.length) {
            return close;
        }
        close = functor(_x);
        return candlestick;
    };
    candlestick.width = (_x) => {
        if (!arguments.length) {
            return width;
        }
        width = functor(_x);
        return candlestick;
    };

    return candlestick;
};
