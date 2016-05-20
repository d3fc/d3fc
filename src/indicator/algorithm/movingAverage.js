import { movingAverage as calculator } from 'd3fc-technical-indicator';
import { rebind } from 'd3fc-rebind';
import merge from './merge';

export default function() {

    var ma = calculator()
        .value(function(d) { return d.close; });

    var mergedAlgorithm = merge()
        .algorithm(ma)
        .merge(function(datum, indicator) {
            datum.movingAverage = indicator;
            return datum;
        });

    var movingAverage = function(data) {
        return mergedAlgorithm(data);
    };

    rebind(movingAverage, mergedAlgorithm, 'merge');
    rebind(movingAverage, ma, 'period', 'value');

    return movingAverage;
}
