import { rebindAll } from '@d3fc/d3fc-rebind';
import { axisBase } from './axisBase';

const axis = (orient, scale) => {
    let tickCenterLabel = false;

    const labelOffset = (tick, index, ticksArray) => {
        let x = 0;
        let y = base.tickSizeInner() + base.tickPadding();
        let hidden = false;
        if (tickCenterLabel) {
            const thisPosition = scale(tick);
            const nextPosition = index < ticksArray.length - 1 ? scale(ticksArray[index + 1]) : scale.range()[1];
            x = (nextPosition - thisPosition) / 2;

            y = base.tickPadding();
            hidden = (index === ticksArray.length - 1) && (thisPosition === nextPosition);
        }
        return { offset: [x, y], hidden };
    };

    const base = axisBase(orient, scale, {labelOffset});

    const axis = (selection) => {
        return base(selection);
    };

    axis.tickCenterLabel = (...args) => {
        if (!args.length) {
            return tickCenterLabel;
        }
        tickCenterLabel = args[0];
        return axis;
    };

    rebindAll(axis, base);
    return axis;
};

export const axisTop = (scale) => axis('top', scale);

export const axisBottom = (scale) => axis('bottom', scale);

export const axisLeft = (scale) => axis('left', scale);

export const axisRight = (scale) => axis('right', scale);
