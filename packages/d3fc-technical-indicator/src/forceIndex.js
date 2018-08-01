import { rebind } from '@d3fc/d3fc-rebind';
import _slidingWindow from './slidingWindow';
import exponentialMovingAverage from './exponentialMovingAverage';
import { convertNaN } from './fn';

export default function() {

    let volumeValue = (d, i) => d.volume;
    let closeValue = (d, i) => d.close;

    const emaComputer = exponentialMovingAverage()
        .period(13);

    const slidingWindow = _slidingWindow()
        .period(2)
        .defined(d => closeValue(d) != null && volumeValue(d) != null)
        .accumulator(values => values &&
            convertNaN((closeValue(values[1]) - closeValue(values[0])) * volumeValue(values[1])));

    const force = data => {
        const forceIndex = slidingWindow(data);
        return emaComputer(forceIndex);
    };

    force.volumeValue = (...args) => {
        if (!args.length) {
            return volumeValue;
        }
        volumeValue = args[0];
        return force;
    };
    force.closeValue = (...args) => {
        if (!args.length) {
            return closeValue;
        }
        closeValue = args[0];
        return force;
    };

    rebind(force, emaComputer, 'period');

    return force;
}
