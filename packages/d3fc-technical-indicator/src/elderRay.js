import { zip } from 'd3-array';
import { includeMap, rebindAll } from 'd3fc-rebind';
import exponentialMovingAverage from './exponentialMovingAverage';
import { identity } from './fn';

export default function() {

    let value = identity;
    let highValue = (d, i) => d.high;
    let lowValue = (d, i) => d.low;

    const emaComputer = exponentialMovingAverage()
        .windowSize(13);

    const elderRay = data => {
        emaComputer.value(value);
        return zip(data, emaComputer(data))
            .map(d =>
                ({
                    bullPower: d[1] ? highValue(d[0]) - d[1] : undefined,
                    bearPower: d[1] ? lowValue(d[0]) - d[1] : undefined
                })
            );
    };

    elderRay.value = (...args) => {
        if (!args.length) {
            return value;
        }
        value = args[0];
        return elderRay;
    };

    elderRay.highValue = (...args) => {
        if (!args.length) {
            return highValue;
        }
        highValue = args[0];
        return elderRay;
    };
    elderRay.lowValue = (...args) => {
        if (!args.length) {
            return highValue;
        }
        lowValue = args[0];
        return elderRay;
    };

    rebindAll(elderRay, emaComputer, includeMap({
        'windowSize': 'period'
    }));

    return elderRay;
}
