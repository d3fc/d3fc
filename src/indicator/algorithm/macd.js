import { macd as calculator } from 'd3fc-technical-indicator';
import { rebind } from 'd3fc-rebind';
import merge from './merge';

export default function() {

    var macdAlgorithm = calculator()
        .value(function(d) { return d.close; });

    var mergedAlgorithm = merge()
        .algorithm(macdAlgorithm)
        .merge(function(datum, indicator) {
            datum.macd = indicator;
            return datum;
        });

    var macd = function(data) {
        return mergedAlgorithm(data);
    };

    rebind(macd, mergedAlgorithm, 'merge');
    rebind(macd, macdAlgorithm, 'fastPeriod', 'slowPeriod', 'signalPeriod', 'value');

    return macd;
}
