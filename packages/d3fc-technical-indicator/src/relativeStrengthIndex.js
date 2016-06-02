import _slidingWindow from './slidingWindow';
import { rebind } from 'd3fc-rebind';
import { convertNaN } from './fn';

export default function() {

    const slidingWindow = _slidingWindow()
        .period(14);
    const wildersSmoothing = (values, prevAvg) => prevAvg + ((values[values.length - 1] - prevAvg) / values.length);
    const sum = (a, b) => a + b;
    const makeAccumulator = (prevClose, prevDownChangesAvg, prevUpChangesAvg) => closes => {
        if (!closes) {
            if (prevClose !== undefined) {
                prevClose = NaN;
            }
            return undefined;
        }
        if (prevClose === undefined) {
            prevClose = closes[0];
            return undefined;
        }

        const downChanges = [];
        const upChanges = [];

        closes.forEach(close => {
            const downChange = prevClose < close ? 0 : prevClose - close;
            const upChange = prevClose > close ? 0 : close - prevClose;

            downChanges.push(downChange);
            upChanges.push(upChange);
            prevClose = isNaN(prevClose) ? NaN : close;
        });

        const downChangesAvg = prevDownChangesAvg ? wildersSmoothing(downChanges, prevDownChangesAvg)
            : downChanges.reduce(sum) / closes.length;

        const upChangesAvg = prevUpChangesAvg ? wildersSmoothing(upChanges, prevUpChangesAvg)
            : upChanges.reduce(sum) / closes.length;

        prevDownChangesAvg = downChangesAvg;
        prevUpChangesAvg = upChangesAvg;

        const rs = upChangesAvg / downChangesAvg;
        return convertNaN(100 - (100 / (1 + rs)));
    };

    var rsi = data => {
        const rsiAccumulator = makeAccumulator();
        slidingWindow.accumulator(rsiAccumulator);
        return slidingWindow(data);
    };

    rebind(rsi, slidingWindow, 'period', 'value');

    return rsi;
}
