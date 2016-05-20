import _slidingWindow from './slidingWindow';
import { rebind } from 'd3fc-rebind';

export default function() {

    const slidingWindow = _slidingWindow()
        .period(14);
    const wildersSmoothing = (values, prevAvg) => prevAvg + ((values[values.length - 1] - prevAvg) / values.length);
    const sum = (a, b) => a + b;
    const makeAccumulator = (prevClose, prevDownChangesAvg, prevUpChangesAvg) => closes => {
        if (!prevClose) {
            prevClose = closes[0];
            return undefined;
        }

        const downChanges = [];
        const upChanges = [];

        closes.forEach(close => {
            const downChange = prevClose > close ? prevClose - close : 0;
            const upChange = prevClose < close ? close - prevClose : 0;

            downChanges.push(downChange);
            upChanges.push(upChange);
            prevClose = close;
        });

        const downChangesAvg = prevDownChangesAvg ? wildersSmoothing(downChanges, prevDownChangesAvg)
            : downChanges.reduce(sum) / closes.length;

        const upChangesAvg = prevUpChangesAvg ? wildersSmoothing(upChanges, prevUpChangesAvg)
            : upChanges.reduce(sum) / closes.length;

        prevDownChangesAvg = downChangesAvg;
        prevUpChangesAvg = upChangesAvg;

        const rs = upChangesAvg / downChangesAvg;
        return 100 - (100 / (1 + rs));
    };

    var rsi = data => {
        const rsiAccumulator = makeAccumulator();
        slidingWindow.accumulator(rsiAccumulator);
        return slidingWindow(data);
    };

    rebind(rsi, slidingWindow, 'period', 'value');

    return rsi;
}
