import { mean, deviation } from 'd3-array';
import { rebind } from '@d3fc/d3fc-rebind';
import _slidingWindow from './slidingWindow';
import { convertNaN } from './fn';

export default function() {

    let multiplier = 2;

    const slidingWindow = _slidingWindow()
        .accumulator(values => {
            const stdDev = values && deviation(values);
            const average = values && mean(values);
            return {
                average: average,
                upper: convertNaN(average + multiplier * stdDev),
                lower: convertNaN(average - multiplier * stdDev)
            };
        });

    const bollingerBands = data => slidingWindow(data);

    bollingerBands.multiplier = (...args) => {
        if (!args.length) {
            return multiplier;
        }
        multiplier = args[0];
        return bollingerBands;
    };

    rebind(bollingerBands, slidingWindow, 'period', 'value');

    return bollingerBands;
}
