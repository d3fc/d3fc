import { max, min } from 'd3-array';
import slidingWindow from './slidingWindow';
import movingAverage from './movingAverage';
import { includeMap, rebindAll } from '@d3fc/d3fc-rebind';
import { convertNaN } from './fn';

export default function() {

    let closeValue = (d, i) => d.close;
    let highValue = (d, i) => d.high;
    let lowValue = (d, i) => d.low;

    const kWindow = slidingWindow()
        .period(5)
        .defined(d => closeValue(d) != null && highValue(d) != null && lowValue(d) != null)
        .accumulator(values => {
            const maxHigh = values && max(values, highValue);
            const minLow = values && min(values, lowValue);
            const kValue = values && 100 * (closeValue(values[values.length - 1]) - minLow) / (maxHigh - minLow);
            return convertNaN(kValue);
        });

    const dWindow = movingAverage()
        .period(3);

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
            return lowValue;
        }
        lowValue = args[0];
        return stochastic;
    };

    rebindAll(stochastic, kWindow, includeMap({'period': 'kPeriod'}));
    rebindAll(stochastic, dWindow, includeMap({'period': 'dPeriod'}));

    return stochastic;
}
