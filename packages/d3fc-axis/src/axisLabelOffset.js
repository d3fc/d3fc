import { rebindAll, exclude } from '@d3fc/d3fc-rebind';
import measureLabels from './measureLabels';

export default (adaptee) => {

    let labelOffsetDepth = 'auto';
    let decorate = () => { };

    const isVertical = () =>
        adaptee.orient() === 'left' || adaptee.orient() === 'right';

    const sign = () => (adaptee.orient() === 'top' || adaptee.orient() === 'left') ? -1 : 1;

    const decorateOffset = sel => {
        const { maxHeight, maxWidth, labelCount } = measureLabels(adaptee)(sel);
        const range = adaptee.scale().range()[1];

        const offsetLevels = labelOffsetDepth === 'auto'
            ? Math.floor(((isVertical() ? maxHeight : maxWidth) * labelCount) / range) + 1
            : labelOffsetDepth;

        const text = sel.select('text');
        const existingTransform = text.attr('transform');

        const transform = i => isVertical()
            ? `translate(${(i % offsetLevels) * maxWidth * sign()}, 0)`
            : `translate(0, ${(i % offsetLevels) * maxHeight * sign()})`;

        text
            .attr('transform', (_, i) => `${existingTransform} ${transform(i)}`);
    };

    const axisLabelOffset = (arg) => adaptee(arg);

    adaptee.decorate(s => {
        decorateOffset(s);
        decorate(s);
    });

    axisLabelOffset.decorate = (...args) => {
        if (!args.length) {
            return decorate;
        }
        decorate = args[0];
        return axisLabelOffset;
    };

    axisLabelOffset.labelOffsetDepth = (...args) => {
        if (!args.length) {
            return labelOffsetDepth;
        }
        labelOffsetDepth = args[0];
        return axisLabelOffset;
    };

    rebindAll(axisLabelOffset, adaptee, exclude('decorate'));

    return axisLabelOffset;
};

