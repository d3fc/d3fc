import _slidingWindow from './slidingWindow';

export default function() {

    let windowSize = 14;
    let closeValue = (d, i) => d.close;
    const wildersSmoothing = (values, prevAvg) => prevAvg + ((values[values.length - 1] - prevAvg) / values.length);
    const sum = (a, b) => a + b;

    var rsi = data => {

        let prevClose, prevDownChangesAvg, prevUpChangesAvg;

        const rsiAccumulator = values => {
            const closes = values.map(closeValue);

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

        const slidingWindow = _slidingWindow()
            .windowSize(windowSize)
            .accumulator(rsiAccumulator);

        return slidingWindow(data);
    };

    rsi.closeValue = (...args) => {
        if (!args.length) {
            return closeValue;
        }
        closeValue = args[0];
        return rsi;
    };

    rsi.windowSize = (...args) => {
        if (!args.length) {
            return windowSize;
        }
        windowSize = args[0];
        return rsi;
    };

    return rsi;
}
