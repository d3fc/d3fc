import { mean, deviation } from 'd3-array';
import { rebind } from 'd3fc-rebind';
import _slidingWindow from './slidingWindow';

export default function() {

    let multiplier = 2;

    const slidingWindow = _slidingWindow()
        .undefinedValue({
            upper: undefined,
            average: undefined,
            lower: undefined
        })
        .accumulator(values => {
            const avg = mean(values);
            const stdDev = deviation(values);
            return {
                upper: avg + multiplier * stdDev,
                average: avg,
                lower: avg - multiplier * stdDev
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

    rebind(bollingerBands, slidingWindow, 'windowSize', 'value');

    return bollingerBands;
}
