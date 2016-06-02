import { identity, functor, convertNaN } from './fn';
import { mean } from 'd3-array';

export default function() {

    let value = identity;
    let period = () => 9;

    const initialMovingAverageAccumulator = period => {
        let values = [];
        return value => {
            let movingAverage;
            if (values.length < period) {
                if (value != null) {
                    values.push(value);
                } else {
                    values = [];
                }
            }
            if (values.length >= period) {
                movingAverage = mean(values);
            }
            return movingAverage;
        };
    };
    const exponentialMovingAverage = function(data) {
        const size = period.apply(this, arguments);
        const alpha = 2 / (size + 1);
        const initialAccumulator = initialMovingAverageAccumulator(size);
        let ema;
        return data.map((d, i) => {
            const v = value(d, i);
            if (ema === undefined) {
                ema = initialAccumulator(v);
            } else {
                ema = v * alpha + (1 - alpha) * ema;
            }
            return convertNaN(ema);
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
