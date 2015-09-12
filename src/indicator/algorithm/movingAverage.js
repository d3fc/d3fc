import calculator from './calculator/slidingWindow';
import d3 from 'd3';
import merge from './merge';

export default function() {

    var ma = calculator()
            .accumulator(d3.mean)
            .value(function(d) { return d.close; });

    var mergedAlgorithm = merge()
            .algorithm(ma)
            .merge(function(datum, ma) { datum.movingAverage = ma; });

    var movingAverage = function(data) {
        return mergedAlgorithm(data);
    };

    d3.rebind(movingAverage, mergedAlgorithm, 'merge');
    d3.rebind(movingAverage, ma, 'windowSize', 'undefinedValue', 'value');

    return movingAverage;
}
