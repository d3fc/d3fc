import { max, min, mean } from 'd3-array';
import slidingWindow from './slidingWindow';
import { includeMap, rebindAll } from 'd3fc-rebind';

export default function() {

    let closeValue = (d, i) => d.close;
    let highValue = (d, i) => d.high;
    let lowValue = (d, i) => d.low;

    const kWindow = slidingWindow()
        .windowSize(5)
        .accumulator(values => {
            const maxHigh = max(values, highValue);
            const minLow = min(values, lowValue);
            return 100 * (closeValue(values[values.length - 1]) - minLow) / (maxHigh - minLow);
        });

    const dWindow = slidingWindow()
        .windowSize(3)
        .accumulator(values => values[0] === undefined ? undefined : mean(values));

    const stochastic = data => {
        const kValues = kWindow(data);
        const dValues = dWindow(kValues);
        return kValues.map((k, i) => ({ k: k, d: dValues[i] }));
    };

    stochastic.closeValue = (...args) => {
        if (!args.length) {
            return closeValue;
        }
        closeValue = args[0];
        return stochastic;
    };
    stochastic.highValue = (...args) => {
        if (!args.length) {
            return highValue;
        }
        highValue = args[0];
        return stochastic;
    };
    stochastic.lowValue = (...args) => {
        if (!args.length) {
            return highValue;
        }
        lowValue = args[0];
        return stochastic;
    };

    rebindAll(stochastic, kWindow, includeMap({'windowSize': 'kWindowSize'}));
    rebindAll(stochastic, dWindow, includeMap({'windowSize': 'dWindowSize'}));

    return stochastic;
}
