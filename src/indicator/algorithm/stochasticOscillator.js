import { stochasticOscillator as calculator } from 'd3fc-technical-indicator';
import { rebind } from 'd3fc-rebind';
import merge from './merge';

export default function() {

    var stoc = calculator();

    var mergedAlgorithm = merge()
        .algorithm(stoc)
        .merge(function(datum, indicator) {
            datum.stochastic = indicator;
            return datum;
        });

    var stochasticOscillator = function(data) {
        return mergedAlgorithm(data);
    };

    rebind(stochasticOscillator, mergedAlgorithm, 'merge');
    rebind(stochasticOscillator, stoc, 'kPeriod', 'dPeriod', 'lowValue', 'closeValue', 'highValue');

    return stochasticOscillator;
}
