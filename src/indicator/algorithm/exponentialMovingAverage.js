import { exponentialMovingAverage as calculator } from 'd3fc-technical-indicator';
import { rebind } from 'd3fc-rebind';
import merge from './merge';

export default function() {

    var ema = calculator()
        .value(function(d) { return d.close; });

    var mergedAlgorithm = merge()
        .algorithm(ema)
        .merge(function(datum, indicator) {
            datum.exponentialMovingAverage = indicator;
            return datum;
        });

    var exponentialMovingAverage = function(data) {
        return mergedAlgorithm(data);
    };

    rebind(exponentialMovingAverage, mergedAlgorithm, 'merge');
    rebind(exponentialMovingAverage, ema, 'period', 'value');

    return exponentialMovingAverage;
}
