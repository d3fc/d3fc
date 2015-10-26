import calculator from './calculator/bollingerBands';
import d3 from 'd3';
import merge from './merge';

export default function () {

    var bollingerAlgorithm = calculator()
        .value(function (d) { return d.close; });

    var mergedAlgorithm = merge()
            .algorithm(bollingerAlgorithm)
            .merge(function (datum, boll) { datum.bollingerBands = boll; });

    var bollingerBands = function (data) {
        return mergedAlgorithm(data);
    };

    bollingerBands.root = function (d) {
        return d.bollingerBands;
    };

    d3.rebind(bollingerBands, mergedAlgorithm, 'merge');
    d3.rebind(bollingerBands, bollingerAlgorithm, 'windowSize', 'value', 'multiplier');

    return bollingerBands;
}
