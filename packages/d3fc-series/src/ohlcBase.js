import { scaleIdentity } from 'd3-scale';
import defined from './defined';
import functor from './functor';
import fractionalBarWidth from './fractionalBarWidth';

export default () => {

    let xScale = scaleIdentity();
    let yScale = scaleIdentity();
    let crossValue = (d) => d.date;
    let openValue = (d) => d.open;
    let highValue = (d) => d.high;
    let lowValue = (d) => d.low;
    let closeValue = (d) => d.close;
    let barWidth = fractionalBarWidth(0.75);
    let decorate = () => {};
    let crossValueScaled = (d, i) => xScale(crossValue(d, i));

    let base = () => {};

    base.width = (data) => barWidth(data.map(crossValueScaled));

    base.defined = (d, i) => defined(crossValue, openValue, lowValue, highValue, closeValue)(d, i);

    base.values = (d, i) => {
        const closeRaw = closeValue(d, i);
        const openRaw = openValue(d, i);

        let direction = '';
        if (closeRaw > openRaw) {
            direction = 'up';
        } else if (closeRaw < openRaw) {
            direction = 'down';
        }

        return {
            cross: crossValueScaled(d, i),
            open: yScale(openRaw),
            high: yScale(highValue(d, i)),
            low: yScale(lowValue(d, i)),
            close: yScale(closeRaw),
            direction
        };
    };

    base.decorate = (...args) => {
        if (!args.length) {
            return decorate;
        }
        decorate = args[0];
        return base;
    };
    base.xScale = (...args) => {
        if (!args.length) {
            return xScale;
        }
        xScale = args[0];
        return base;
    };
    base.yScale = (...args) => {
        if (!args.length) {
            return yScale;
        }
        yScale = args[0];
        return base;
    };
    base.crossValue = (...args) => {
        if (!args.length) {
            return crossValue;
        }
        crossValue = args[0];
        return base;
    };
    base.openValue = (...args) => {
        if (!args.length) {
            return openValue;
        }
        openValue = args[0];
        return base;
    };
    base.highValue = (...args) => {
        if (!args.length) {
            return highValue;
        }
        highValue = args[0];
        return base;
    };
    base.lowValue = (...args) => {
        if (!args.length) {
            return lowValue;
        }
        lowValue = args[0];
        return base;
    };
    base.yValue = base.closeValue = (...args) => {
        if (!args.length) {
            return closeValue;
        }
        closeValue = args[0];
        return base;
    };
    base.barWidth = (...args) => {
        if (!args.length) {
            return barWidth;
        }
        barWidth = functor(args[0]);
        return base;
    };

    return base;
};
