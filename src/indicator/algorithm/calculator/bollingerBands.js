import d3 from 'd3';
import _slidingWindow from './slidingWindow';

export default function () {

    var multiplier = 2;

    var slidingWindow = _slidingWindow()
        .undefinedValue({
            upper: undefined,
            average: undefined,
            lower: undefined
        })
        .accumulator(function (values) {
            var avg = d3.mean(values);
            var stdDev = d3.deviation(values);
            return {
                upper: avg + multiplier * stdDev,
                average: avg,
                lower: avg - multiplier * stdDev
            };
        });

    var bollingerBands = function (data) {
        return slidingWindow(data);
    };

    bollingerBands.multiplier = function (x) {
        if (!arguments.length) {
            return multiplier;
        }
        multiplier = x;
        return bollingerBands;
    };

    d3.rebind(bollingerBands, slidingWindow, 'windowSize', 'value');

    return bollingerBands;
}
