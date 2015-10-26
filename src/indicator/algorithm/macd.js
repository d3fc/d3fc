import calculator from './calculator/macd';
import d3 from 'd3';
import merge from './merge';

export default function () {

    var macdAlgorithm = calculator()
        .value(function (d) { return d.close; });

    var mergedAlgorithm = merge()
            .algorithm(macdAlgorithm)
            .merge(function (datum, macd) { datum.macd = macd; });

    var macd = function (data) {
        return mergedAlgorithm(data);
    };

    d3.rebind(macd, mergedAlgorithm, 'merge');
    d3.rebind(macd, macdAlgorithm, 'fastPeriod', 'slowPeriod', 'signalPeriod', 'value');

    return macd;
}
