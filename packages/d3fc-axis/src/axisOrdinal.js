import { dataJoin as _dataJoin } from '@d3fc/d3fc-data-join';
import { rebindAll, exclude } from '@d3fc/d3fc-rebind';
import { axisBase } from './axisBase';

const axisOrdinal = (orient, scale) => {
    let tickOffset = null;
    let labelRotate;
    let decorate = () => {};
    let rotation;

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
        if (tickOffset) {
            x = tickOffset(tick, index);
        } else {
            x = step(tick, index, ticksArray) / 2;
        }
        return {
            path: [[x, 0], [x, base.tickSizeInner()]],
            hidden: index === ticksArray.length - 1
        };
    };
    const labelOffset = () => {
        // Don't include the tickSizeInner in the label positioning
        return { offset: [0, base.tickPadding()] };
    };

    const decorateRotation = s => {
        if (labelRotate) {
            const { rotate, labelHeight, anchor } = rotation;

            const text = s.select('text');
            const existingTransform = text.attr('transform');

            const offset = sign() * Math.floor(labelHeight / 2);
            const offsetTransform = isVertical() ? `translate(${offset}, 0)` : `translate(0, ${offset})`;

            text.style('text-anchor', anchor)
                .attr('transform', `${existingTransform} ${offsetTransform} rotate(${rotate} 0 0)`);
        }
    };

    const measureLabels = s => {
        const labels = scale.domain();

        // Use a test element to measure the text in the axis SVG container
        s.attr('font-size', 10).attr('font-family', 'sans-serif');
        const tester = s.append('text');
        const labelHeight = tester.text('Ty').node().getBBox().height;
        const maxWidth = Math.max(...labels.map(l => tester.text(l).node().getBBox().width));
        tester.remove();

        return {
            labelHeight,
            maxWidth,
            measuredSize: labels.length * maxWidth
        };
    };

    const calculateRotation = s => {
        if (labelRotate) {
            const { labelHeight, maxWidth, measuredSize } = measureLabels(s);

            // The more the overlap, the more we rotate
            let rotate;
            if (labelRotate === 'auto') {
                const range = scale.range()[1];
                rotate = range < measuredSize ? 90 * Math.min(1, (measuredSize / range - 0.8) / 2) : 0;
            } else {
                rotate = labelRotate;
            }

            rotation = {
                rotate: isVertical() ? Math.floor(sign() * (90 - rotate)) : Math.floor(-rotate),
                labelHeight,
                maxWidth,
                anchor: rotate ? labelAnchor() : 'middle'
            };
        } else {
            rotation = {
                rotate: 0,
                anchor: isVertical() ? labelAnchor() : 'middle'
            };
        }
    };

    const isVertical = () =>
        orient === 'left' || orient === 'right';
    const sign = () => (orient === 'top' || orient === 'left') ? -1 : 1;

    const labelAnchor = () => {
        switch (orient) {
        case 'top':
        case 'right':
            return 'start';
        default:
            return 'end';
        }
    };

    const base = axisBase(orient, scale, {labelOffset, tickPath});

    base.decorate(s => {
        decorateRotation(s);
        decorate(s);
    });

    const axis = (selection) => {
        if (!rotation) calculateRotation(selection);
        base(selection);
        rotation = null;
    };

    const calculateSize = s => {
        if (labelRotate) {
            calculateRotation(s);
            const { maxWidth, labelHeight } = rotation;

            const degrees = rotation.rotate + (isVertical() ? 90 : 0);
            const radians = degrees / 90 * Math.PI / 2;

            return Math.floor(
                    maxWidth * Math.abs(Math.sin(radians)) +
                    labelHeight * Math.abs(Math.cos(radians)) +
                    Math.floor(labelHeight / 2) + 2 * base.tickPadding()
                );
        }
        return null;
    };

    axis.height = (selection) => {
        if (isVertical()) return null;
        return calculateSize(selection);
    };

    axis.width = (selection) => {
        if (!isVertical()) return null;
        return calculateSize(selection);
    };

    axis.tickOffset = (...args) => {
        if (!args.length) {
            return tickOffset;
        }
        tickOffset = args[0];
        return axis;
    };

    axis.labelRotate = (...args) => {
        if (!args.length) {
            return labelRotate;
        }
        labelRotate = args[0];
        return axis;
    };

    axis.decorate = (...args) => {
        if (!args.length) {
            return decorate;
        }
        decorate = args[0];
        return axis;
    };

    rebindAll(axis, base, exclude('decorate'));
    return axis;
};

export const axisOrdinalTop = (scale) => axisOrdinal('top', scale);

export const axisOrdinalBottom = (scale) => axisOrdinal('bottom', scale);

export const axisOrdinalLeft = (scale) => axisOrdinal('left', scale);

export const axisOrdinalRight = (scale) => axisOrdinal('right', scale);
