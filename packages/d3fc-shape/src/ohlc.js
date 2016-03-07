import functor from './functor';

// Renders an OHLC as an SVG path based on the given array of datapoints. Each
// OHLC has a fixed width, whilst the x, open, high, low and close positions are
// obtained from each point via the supplied accessor functions.
export default (context) => {
    let x       = (d) => d.date;
    let open    = (d) => d.open;
    let high    = (d) => d.high;
    let low     = (d) => d.low;
    let close   = (d) => d.close;
    let orient  = 'vertical';
    let width   = functor(3);

    const ohlc = (data) => {

        data.forEach((d, i) => {
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

        return context;
    };

    ohlc.x = (_x) => {
        if (!arguments.length) {
            return x;
        }
        x = functor(_x);
        return ohlc;
    };
    ohlc.open = (_x) => {
        if (!arguments.length) {
            return open;
        }
        open = functor(_x);
        return ohlc;
    };
    ohlc.high = (_x) => {
        if (!arguments.length) {
            return high;
        }
        high = functor(_x);
        return ohlc;
    };
    ohlc.low = (_x) => {
        if (!arguments.length) {
            return low;
        }
        low = functor(_x);
        return ohlc;
    };
    ohlc.close = (_x) => {
        if (!arguments.length) {
            return close;
        }
        close = functor(_x);
        return ohlc;
    };
    ohlc.width = (_x) => {
        if (!arguments.length) {
            return width;
        }
        width = functor(_x);
        return ohlc;
    };
    ohlc.orient = (_x) => {
        if (!arguments.length) {
            return orient;
        }
        orient = _x;
        return ohlc;
    };

    return ohlc;
};
