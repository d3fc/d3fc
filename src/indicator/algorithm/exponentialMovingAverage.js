import d3 from 'd3';
import indicator_algorithm_calculator_exponentialMovingAverage from './calculator/exponentialMovingAverage';
import indicator_algorithm_merge from './merge';

export default function() {

    var ema = indicator_algorithm_calculator_exponentialMovingAverage()
            .value(function(d) { return d.close; });

    var mergedAlgorithm = indicator_algorithm_merge()
            .algorithm(ema)
            .merge(function(datum, ma) { datum.exponentialMovingAverage = ma; });

    var exponentialMovingAverage = function(data) {
        return mergedAlgorithm(data);
    };

    d3.rebind(exponentialMovingAverage, mergedAlgorithm, 'merge');
    d3.rebind(exponentialMovingAverage, ema, 'windowSize', 'value');

    return exponentialMovingAverage;
}
