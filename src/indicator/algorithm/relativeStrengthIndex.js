import calculator from './calculator/relativeStrengthIndex';
import d3 from 'd3';
import merge from './merge';

export default function () {

    var rsi = calculator();

    var mergedAlgorithm = merge()
            .algorithm(rsi)
            .merge(function (datum, rsi) { datum.rsi = rsi; });

    var relativeStrengthIndex = function (data) {
        return mergedAlgorithm(data);
    };

    d3.rebind(relativeStrengthIndex, mergedAlgorithm, 'merge');
    d3.rebind(relativeStrengthIndex, rsi, 'windowSize', 'openValue', 'closeValue');

    return relativeStrengthIndex;
}
