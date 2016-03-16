import d3 from 'd3';
import exponentialMovingAverage from './exponentialMovingAverage';
import undefinedInputAdapter from './undefinedInputAdapter';
import {identity} from '../../../util/fn';
import {includeMap, rebindAll} from 'd3fc-rebind';


export default function() {

    var value = identity;

    var fastEMA = exponentialMovingAverage()
        .windowSize(12);
    var slowEMA = exponentialMovingAverage()
        .windowSize(29);
    var signalEMA = exponentialMovingAverage()
        .windowSize(9);
    var adaptedSignalEMA = undefinedInputAdapter()
        .algorithm(signalEMA);

    var macd = function(data) {

        fastEMA.value(value);
        slowEMA.value(value);

        var diff = d3.zip(fastEMA(data), slowEMA(data))
            .map(function(d) {
                if (d[0] !== undefined && d[1] !== undefined) {
                    return d[0] - d[1];
                } else {
                    return undefined;
                }
            });

        var averageDiff = adaptedSignalEMA(diff);

        return d3.zip(diff, averageDiff)
            .map(function(d) {
                return {
                    macd: d[0],
                    signal: d[1],
                    divergence: d[0] !== undefined && d[1] !== undefined ? d[0] - d[1] : undefined
                };
            });
    };

    macd.value = function(x) {
        if (!arguments.length) {
            return value;
        }
        value = x;
        return macd;
    };

    rebindAll(macd, fastEMA, includeMap({'windowSize': 'fastPeriod'}));
    rebindAll(macd, slowEMA, includeMap({'windowSize': 'slowPeriod'}));
    rebindAll(macd, signalEMA, includeMap({'windowSize': 'signalPeriod'}));

    return macd;
}
