import calculator from './calculator/relativeStrengthIndex';
import d3 from 'd3';
import merge from './merge';

export default function() {

    var force = calculator();

    var mergedAlgorithm = merge()
            .algorithm(force)
            .merge(function(datum, force) { datum.force = force; });

    var forceIndex = function(data) {
        return mergedAlgorithm(data);
    };

    d3.rebind(forceIndex, mergedAlgorithm, 'merge');
    d3.rebind(forceIndex, force, 'windowSize', 'volumeValue', 'closeValue');

    return forceIndex;
}
