import calculator from './calculator/elderRay';
import d3 from 'd3';
import merge from './merge';

export default function() {

    var elderRayAlgorithm = calculator()
        .value(function(d) { return d.close; });

    var mergedAlgorithm = merge()
            .algorithm(elderRayAlgorithm)
            .merge(function(datum, indicator) { datum.elderRay = indicator; });

    var elderRay = function(data) {
        return mergedAlgorithm(data);
    };

    d3.rebind(elderRay, mergedAlgorithm, 'merge');
    d3.rebind(elderRay, elderRayAlgorithm, 'highValue', 'lowValue', 'period', 'value');

    return elderRay;
}
