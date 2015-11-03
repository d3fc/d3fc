import d3 from 'd3';
import exponentialMovingAverage from './exponentialMovingAverage';
import {identity} from '../../../util/fn';
import {rebind} from '../../../util/rebind';

export default function() {

    var value = identity;

    var highValue = function(d, i) { return d.high; },
        lowValue = function(d, i) { return d.low; };

    var ema = exponentialMovingAverage()
        .windowSize(13);

    var elderRay = function(data) {

        ema.value(value);
        var x = ema(data);

        var elderRay = d3.zip(data, x)
            .map(function(d) {
                var bullPower = highValue(d[0]) - d[1],
                    bearPower = lowValue(d[0]) - d[1],
                    bullTop = false,
                    bearTop = false;

                if (bullPower * bearPower > 0) {
                    // The values share parity
                    bullTop = Math.abs(bullPower) < Math.abs(bearPower);
                    bearTop = !bullTop;
                }

                return {
                    bullPower: bullPower,
                    bearPower: bearPower,
                    bullTop: bullTop,
                    bearTop: bearTop
                };
            });

        return elderRay;
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

    rebind(elderRay, ema, {
        period: 'windowSize'
    });

    return elderRay;
}
