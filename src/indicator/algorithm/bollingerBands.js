import { bollingerBands as calculator } from 'd3fc-technical-indicator';
import { rebind } from 'd3fc-rebind';
import merge from './merge';

export default function() {

    var bollingerAlgorithm = calculator()
        .value(function(d) { return d.close; });

    var mergedAlgorithm = merge()
        .algorithm(bollingerAlgorithm)
        .merge(function(datum, indicator) {
            datum.bollingerBands = indicator;
            return datum;
        });

    var bollingerBands = function(data) {
        return mergedAlgorithm(data);
    };

    bollingerBands.root = function(d) {
        return d.bollingerBands;
    };

    rebind(bollingerBands, mergedAlgorithm, 'merge');
    rebind(bollingerBands, bollingerAlgorithm, 'period', 'value', 'multiplier');

    return bollingerBands;
}
