import { identity, noop, functor } from './fn';

export default function() {

    let undefinedValue = () => undefined;
    let period = () => 10;
    let accumulator = noop;
    let value = identity;

    var slidingWindow = function(data) {
        const size = period.apply(this, arguments);
        const windowData = data.slice(0, size).map(value);
        return data.map((d, i) => {
            if (i < size - 1) {
                return undefinedValue(d, i);
            }
            if (i >= size) {
                // Treat windowData as FIFO rolling buffer
                windowData.shift();
                windowData.push(value(d, i));
            }
            return accumulator(windowData);
        });
    };

    slidingWindow.undefinedValue = (...args) => {
        if (!args.length) {
            return undefinedValue;
        }
        undefinedValue = functor(args[0]);
        return slidingWindow;
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
    slidingWindow.value = (...args) => {
        if (!args.length) {
            return value;
        }
        value = args[0];
        return slidingWindow;
    };

    return slidingWindow;
}
