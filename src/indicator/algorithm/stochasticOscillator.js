import calculator from './calculator/stochasticOscillator';
import d3 from 'd3';
import merge from './merge';

export default function () {

    var stoc = calculator();

    var mergedAlgorithm = merge()
            .algorithm(stoc)
            .merge(function (datum, stoc) { datum.stochastic = stoc; });

    var stochasticOscillator = function (data) {
        return mergedAlgorithm(data);
    };

    d3.rebind(stochasticOscillator, mergedAlgorithm, 'merge');
    d3.rebind(stochasticOscillator, stoc, 'kWindowSize', 'dWindowSize', 'lowValue', 'closeValue', 'highValue');

    return stochasticOscillator;
}
