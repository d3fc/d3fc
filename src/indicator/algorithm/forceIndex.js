import { forceIndex as calculator } from 'd3fc-technical-indicator';
import { rebind } from 'd3fc-rebind';
import merge from './merge';

export default function() {

    var force = calculator();

    var mergedAlgorithm = merge()
        .algorithm(force)
        .merge(function(datum, indicator) {
            datum.force = indicator;
            return datum;
        });

    var forceIndex = function(data) {
        return mergedAlgorithm(data);
    };

    rebind(forceIndex, mergedAlgorithm, 'merge');
    rebind(forceIndex, force, 'period', 'volumeValue', 'closeValue');

    return forceIndex;
}
