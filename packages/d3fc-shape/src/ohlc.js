import { path } from 'd3-path';
import functor from './functor';

// Renders an OHLC as an SVG path based on the given array of datapoints. Each
// OHLC has a fixed width, whilst the x, open, high, low and close positions are
// obtained from each point via the supplied accessor functions.
export default () => {

    let context = null;
    let x       = (d) => d.date;
    let open    = (d) => d.open;
    let high    = (d) => d.high;
    let low     = (d) => d.low;
    let close   = (d) => d.close;
    let orient  = 'vertical';
    let width   = functor(3);

    const ohlc = function(data) {

        const buffer = context ? undefined : context = path();

        data.forEach(function(d, i) {
            const xValue      = x(d, i);
            const yOpen       = open(d, i);
            const yHigh       = high(d, i);
            const yLow        = low(d, i);
            const yClose      = close(d, i);
            const halfWidth   = width(d, i) / 2;

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

        return buffer && (context = null, buffer.toString() || null);
    };

    ohlc.context = (...args) => {
        if (!args.length) {
            return context;
        }
        context = args[0];
        return ohlc;
    };
    ohlc.x = (...args) => {
        if (!args.length) {
            return x;
        }
        x = functor(args[0]);
        return ohlc;
    };
    ohlc.open = (...args) => {
        if (!args.length) {
            return open;
        }
        open = functor(args[0]);
        return ohlc;
    };
    ohlc.high = (...args) => {
        if (!args.length) {
            return high;
        }
        high = functor(args[0]);
        return ohlc;
    };
    ohlc.low = (...args) => {
        if (!args.length) {
            return low;
        }
        low = functor(args[0]);
        return ohlc;
    };
    ohlc.close = (...args) => {
        if (!args.length) {
            return close;
        }
        close = functor(args[0]);
        return ohlc;
    };
    ohlc.width = (...args) => {
        if (!args.length) {
            return width;
        }
        width = functor(args[0]);
        return ohlc;
    };
    ohlc.orient = (...args) => {
        if (!args.length) {
            return orient;
        }
        orient = args[0];
        return ohlc;
    };

    return ohlc;
};
