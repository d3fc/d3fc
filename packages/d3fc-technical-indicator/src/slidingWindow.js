import { identity, noop, functor } from './fn';

export default function() {

    let period = () => 10;
    let accumulator = noop;
    let value = identity;
    let defined = (d) => d != null;

    var slidingWindow = function(data) {
        const size = period.apply(this, arguments);
        const windowData = data.slice(0, size).map(value);
        return data.map((d, i) => {
            if (i >= size) {
                // Treat windowData as FIFO rolling buffer
                windowData.shift();
                windowData.push(value(d, i));
            }
            if (i < size - 1 || windowData.some(d => !defined(d))) {
                return accumulator(undefined, i);
            }
            return accumulator(windowData, i);
        });
    };

    slidingWindow.period = (...args) => {
        if (!args.length) {
            return period;
        }
        period = functor(args[0]);
        return slidingWindow;
    };
    slidingWindow.accumulator = (...args) => {
        if (!args.length) {
            return accumulator;
        }
        accumulator = args[0];
        return slidingWindow;
    };
    slidingWindow.defined = (...args) => {
        if (!args.length) {
            return defined;
        }
        defined = args[0];
        return slidingWindow;
    };
    slidingWindow.value = (...args) => {
        if (!args.length) {
            return value;
        }
        value = args[0];
        return slidingWindow;
    };

    return slidingWindow;
}
