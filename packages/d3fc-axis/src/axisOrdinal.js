import { dataJoin as _dataJoin } from '@d3fc/d3fc-data-join';
import { rebindAll } from '@d3fc/d3fc-rebind';
import { axisBase } from './axisBase';

const axisOrdinal = (orient, scale) => {
    let tickLineAlign = 'center';
    let tickOffset = null;

    const step = (tick, index, ticksArray) => {
        if (scale.step) {
            // Use the scale step size
            return scale.step();
        }
        const thisPosition = scale(tick);
        if (index < ticksArray.length - 1) {
            // Distance between ticks
            return scale(ticksArray[index + 1]) / thisPosition;
        } else {
            // 2* distance to end
            return (scale.range()[1] - thisPosition) * 2;
        }
    };

    const tickPath = (tick, index, ticksArray) => {
        let x = 0;
        let hidden = false;
        if (tickLineAlign !== 'center') {
            if (tickOffset) {
                x = tickOffset(tick, index);
            } else {
                x = step(tick, index, ticksArray) / 2;
            }
            if (tickLineAlign === 'left') {
                x = -x;
                hidden = index === 0;
            } else {
                hidden = index === ticksArray.length - 1;
            }
        }
        return { path: [[x, 0], [x, base.tickSizeInner()]], hidden };
    };
    const labelOffset = () => {
        if (tickLineAlign !== 'center') {
            // Don't include the tickSizeInner in the label positioning
            return { offset: [0, base.tickPadding()] };
        }
        return { offset: [0, base.tickSizeInner() + base.tickPadding()] };
    };

    const base = axisBase(orient, scale, {labelOffset, tickPath});

    const axis = (selection) => {
        return base(selection);
    };

    axis.tickLineAlign = (...args) => {
        if (!args.length) {
            return tickLineAlign;
        }
        tickLineAlign = args[0];
        return axis;
    };

    axis.tickOffset = (...args) => {
        if (!args.length) {
            return tickOffset;
        }
        tickOffset = args[0];
        return axis;
    };

    rebindAll(axis, base);
    return axis;
};

export const axisOrdinalTop = (scale) => axisOrdinal('top', scale);

export const axisOrdinalBottom = (scale) => axisOrdinal('bottom', scale);

export const axisOrdinalLeft = (scale) => axisOrdinal('left', scale);

export const axisOrdinalRight = (scale) => axisOrdinal('right', scale);
