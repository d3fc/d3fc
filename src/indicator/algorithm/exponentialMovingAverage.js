import calculator from './calculator/slidingWindow';
import d3 from 'd3';
import merge from './merge';

export default function() {

    var ema = calculator()
            .accumulator(d3.mean)
            .value(function(d) { return d.close; });

    var mergedAlgorithm = merge()
            .algorithm(ema)
            .merge(function(datum, ma) { datum.exponentialMovingAverage = ma; });

    var exponentialMovingAverage = function(data) {
        return mergedAlgorithm(data);
    };

    d3.rebind(exponentialMovingAverage, mergedAlgorithm, 'merge');
    d3.rebind(exponentialMovingAverage, ema, 'windowSize', 'value');

    return exponentialMovingAverage;
}
