import { path } from 'd3-path';
import functor from './functor';

// Renders a candlestick as an SVG path based on the given array of datapoints. Each
// candlestick has a fixed width, whilst the x, open, high, low and close positions are
// obtained from each point via the supplied accessor functions.
export default () => {

    let context = null;
    let x       = (d) => d.date;
    let open    = (d) => d.open;
    let high    = (d) => d.high;
    let low     = (d) => d.low;
    let close   = (d) => d.close;
    let width   = functor(3);

    const candlestick = function(data) {

        const buffer = context ? undefined : context = path();

        data.forEach(function(d, i) {
            const xValue        = x(d, i);
            const yOpen         = open(d, i);
            const yHigh         = high(d, i);
            const yLow          = low(d, i);
            const yClose        = close(d, i);
            const barWidth      = width(d, i);
            const halfBarWidth  = barWidth / 2;

            // Body
            context.rect(xValue - halfBarWidth, yOpen, barWidth, yClose - yOpen);
            // High wick
            // // Move to the max price of close or open; draw the high wick
            // N.B. Math.min() is used as we're dealing with pixel values,
            // the lower the pixel value, the higher the price!
            context.moveTo(xValue, Math.min(yClose, yOpen));
            context.lineTo(xValue, yHigh);
            // Low wick
            // // Move to the min price of close or open; draw the low wick
            // N.B. Math.max() is used as we're dealing with pixel values,
            // the higher the pixel value, the lower the price!
            context.moveTo(xValue, Math.max(yClose, yOpen));
            context.lineTo(xValue, yLow);
        });

        return buffer && (context = null, buffer.toString() || null);
    };

    candlestick.context = (...args) => {
        if (!args.length) {
            return context;
        }
        context = args[0];
        return candlestick;
    };
    candlestick.x = (...args) => {
        if (!args.length) {
            return x;
        }
        x = functor(args[0]);
        return candlestick;
    };
    candlestick.open = (...args) => {
        if (!args.length) {
            return open;
        }
        open = functor(args[0]);
        return candlestick;
    };
    candlestick.high = (...args) => {
        if (!args.length) {
            return high;
        }
        high = functor(args[0]);
        return candlestick;
    };
    candlestick.low = (...args) => {
        if (!args.length) {
            return low;
        }
        low = functor(args[0]);
        return candlestick;
    };
    candlestick.close = (...args) => {
        if (!args.length) {
            return close;
        }
        close = functor(args[0]);
        return candlestick;
    };
    candlestick.width = (...args) => {
        if (!args.length) {
            return width;
        }
        width = functor(args[0]);
        return candlestick;
    };

    return candlestick;
};
