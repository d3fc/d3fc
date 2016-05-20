import { identity, functor } from './fn';

export default function() {

    let period = () => 9;
    let value = identity;

    const exponentialMovingAverage = function(data) {
        const size = period.apply(this, arguments);
        const alpha = 2 / (size + 1);
        let previous;
        let initialAccumulator = 0;

        return data.map((d, i) => {
            if (i < size - 1) {
                initialAccumulator += value(d, i);
                return undefined;
            } else if (i === size - 1) {
                initialAccumulator += value(d, i);
                var initialValue = initialAccumulator / size;
                previous = initialValue;
                return initialValue;
            } else {
                var nextValue = value(d, i) * alpha + (1 - alpha) * previous;
                previous = nextValue;
                return nextValue;
            }
        });
    };

    exponentialMovingAverage.period = (...args) => {
        if (!args.length) {
            return period;
        }
        period = functor(args[0]);
        return exponentialMovingAverage;
    };

    exponentialMovingAverage.value = (...args) => {
        if (!args.length) {
            return value;
        }
        value = args[0];
        return exponentialMovingAverage;
    };

    return exponentialMovingAverage;
}
