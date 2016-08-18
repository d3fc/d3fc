import { scaleIdentity } from 'd3-scale';

export default () => {

    let scale = scaleIdentity();
    let count = 10;
    let tickValues = null;

    const ticks = () =>
        tickValues != null ? tickValues
            : (scale.ticks ? scale.ticks(count) : scale.domain());

    ticks.scale = (...args) => {
        if (!args.length) {
            return scale;
        }
        scale = args[0];
        return ticks;
    };

    ticks.ticks = (...args) => {
        if (!args.length) {
            return count;
        }
        count = args[0];
        return ticks;
    };

    ticks.tickValues = (...args) => {
        if (!args.length) {
            return tickValues;
        }
        tickValues = args[0];
        return ticks;
    };

    return ticks;
};
