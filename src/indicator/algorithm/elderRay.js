import { elderRay as calculator } from 'd3fc-technical-indicator';
import { rebind } from 'd3fc-rebind';
import merge from './merge';

export default function() {

    var elderRayAlgorithm = calculator()
        .closeValue(function(d) { return d.close; });

    var mergedAlgorithm = merge()
        .algorithm(elderRayAlgorithm)
        .merge(function(datum, indicator) {
            datum.elderRay = indicator;
            return datum;
        });

    var elderRay = function(data) {
        return mergedAlgorithm(data);
    };

    rebind(elderRay, mergedAlgorithm, 'merge');
    rebind(elderRay, elderRayAlgorithm, 'highValue', 'lowValue', 'period', 'value');

    return elderRay;
}
