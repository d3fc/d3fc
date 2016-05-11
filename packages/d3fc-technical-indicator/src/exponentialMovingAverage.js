import { identity } from './fn';

export default function() {

    let windowSize = 9;
    let value = identity;

    const exponentialMovingAverage = data => {

        const alpha = 2 / (windowSize + 1);
        let previous;
        let initialAccumulator = 0;

        return data.map((d, i) => {
            if (i < windowSize - 1) {
                initialAccumulator += value(d, i);
                return undefined;
            } else if (i === windowSize - 1) {
                initialAccumulator += value(d, i);
                var initialValue = initialAccumulator / windowSize;
                previous = initialValue;
                return initialValue;
            } else {
                var nextValue = value(d, i) * alpha + (1 - alpha) * previous;
                previous = nextValue;
                return nextValue;
            }
        });
    };

    exponentialMovingAverage.windowSize = function(...args) {
        if (!args.length) {
            return windowSize;
        }
        windowSize = args[0];
        return exponentialMovingAverage;
    };

    exponentialMovingAverage.value = function(...args) {
        if (!args.length) {
            return value;
        }
        value = args[0];
        return exponentialMovingAverage;
    };

    return exponentialMovingAverage;
}
