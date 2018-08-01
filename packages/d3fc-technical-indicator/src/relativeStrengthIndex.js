import _slidingWindow from './slidingWindow';
import { rebind } from '@d3fc/d3fc-rebind';
import { convertNaN } from './fn';
import { pairs, mean } from 'd3-array';

export default function() {

    const slidingWindow = _slidingWindow()
        .period(14);
    const wildersSmoothing = (values, prevAvg) => prevAvg + ((values[values.length - 1] - prevAvg) / values.length);
    const downChange = ([prevClose, close]) =>  prevClose < close ? 0 : prevClose - close;
    const upChange = ([prevClose, close]) => prevClose > close ? 0 : close - prevClose;

    const updateAverage = (changes, prevAverage) =>
        prevAverage !== undefined ? wildersSmoothing(changes, prevAverage) : mean(changes);

    const makeAccumulator = () => {
        let prevClose;
        let downChangesAvg;
        let upChangesAvg;
        return closes => {
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

            const closePairs = pairs([prevClose, ...closes]);
            downChangesAvg = updateAverage(closePairs.map(downChange), downChangesAvg);
            upChangesAvg = updateAverage(closePairs.map(upChange), upChangesAvg);
            const rs = !isNaN(prevClose) ? (upChangesAvg / downChangesAvg) : NaN;
            return convertNaN(100 - (100 / (1 + rs)));
        };
    };

    var rsi = data => {
        const rsiAccumulator = makeAccumulator();
        slidingWindow.accumulator(rsiAccumulator);
        return slidingWindow(data);
    };

    rebind(rsi, slidingWindow, 'period', 'value');
    return rsi;
}
