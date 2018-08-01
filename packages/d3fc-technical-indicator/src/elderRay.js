import { zip } from 'd3-array';
import { rebind } from '@d3fc/d3fc-rebind';
import exponentialMovingAverage from './exponentialMovingAverage';
import { convertNaN } from './fn';

export default function() {

    let closeValue = (d, i) => d.close;
    let highValue = (d, i) => d.high;
    let lowValue = (d, i) => d.low;

    const emaComputer = exponentialMovingAverage()
        .period(13);

    const elderRay = data => {
        emaComputer.value(closeValue);
        return zip(data, emaComputer(data))
            .map(d => {
                const bullPower = convertNaN(highValue(d[0]) - d[1]);
                const bearPower = convertNaN(lowValue(d[0]) - d[1]);
                return { bullPower, bearPower };
            });
    };

    elderRay.closeValue = (...args) => {
        if (!args.length) {
            return closeValue;
        }
        closeValue = args[0];
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
            return lowValue;
        }
        lowValue = args[0];
        return elderRay;
    };

    rebind(elderRay, emaComputer, 'period');

    return elderRay;
}
