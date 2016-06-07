import { relativeStrengthIndex as calculator } from 'd3fc-technical-indicator';
import { rebind } from 'd3fc-rebind';
import merge from './merge';

export default function() {

    var rsi = calculator();

    var mergedAlgorithm = merge()
        .algorithm(rsi)
        .merge(function(datum, indicator) {
            datum.rsi = indicator;
            return datum;
        });

    var relativeStrengthIndex = function(data) {
        return mergedAlgorithm(data);
    };

    rebind(relativeStrengthIndex, mergedAlgorithm, 'merge');
    rebind(relativeStrengthIndex, rsi, 'period', 'value');

    return relativeStrengthIndex;
}
