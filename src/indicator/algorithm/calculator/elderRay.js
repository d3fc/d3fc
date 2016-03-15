import d3 from 'd3';
import exponentialMovingAverage from './exponentialMovingAverage';
import {identity} from '../../../util/fn';
import {includeMap, rebindAll} from 'd3fc-rebind';

export default function() {

    var value = identity;

    var highValue = function(d, i) { return d.high; },
        lowValue = function(d, i) { return d.low; };

    var emaComputer = exponentialMovingAverage()
        .windowSize(13);

    var elderRay = function(data) {

        emaComputer.value(value);
        var ema = emaComputer(data);

        var indicator = d3.zip(data, ema)
            .map(function(d) {
                return {
                    bullPower: d[1] ? highValue(d[0]) - d[1] : undefined,
                    bearPower: d[1] ? lowValue(d[0]) - d[1] : undefined
                };
            });

        return indicator;
    };

    elderRay.value = function(x) {
        if (!arguments.length) {
            return value;
        }
        value = x;
        return elderRay;
    };

    elderRay.highValue = function(x) {
        if (!arguments.length) {
            return highValue;
        }
        highValue = x;
        return elderRay;
    };
    elderRay.lowValue = function(x) {
        if (!arguments.length) {
            return highValue;
        }
        lowValue = x;
        return elderRay;
    };

    rebindAll(elderRay, emaComputer, includeMap({
        'windowSize': 'period'
    }));

    return elderRay;
}
