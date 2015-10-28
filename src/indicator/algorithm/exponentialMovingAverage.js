import d3 from 'd3';
import exponentialMovingAverageCalculator from './calculator/exponentialMovingAverage';
import merge from './merge';

export default function() {

    var ema = exponentialMovingAverageCalculator()
            .value(function(d) { return d.close; });

    var mergedAlgorithm = merge()
            .algorithm(ema)
            .merge(function(datum, indicator) { datum.exponentialMovingAverage = indicator; });

    var exponentialMovingAverage = function(data) {
        return mergedAlgorithm(data);
    };

    d3.rebind(exponentialMovingAverage, mergedAlgorithm, 'merge');
    d3.rebind(exponentialMovingAverage, ema, 'windowSize', 'value');

    return exponentialMovingAverage;
}
