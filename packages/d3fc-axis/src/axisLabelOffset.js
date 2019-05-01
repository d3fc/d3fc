import { rebindAll, exclude } from '@d3fc/d3fc-rebind';

export default (adaptee) => {

    let labelOffsetDepth = 'auto';
    let decorate = () => { };

    const measureLabels = s => {
        const scale = adaptee.scale();
        const labels = scale['ticks'] ? scale.ticks() : scale.domain();

        const tester = s.append('text');
        const boundingBoxes = labels.map(l => tester.text(l).node().getBBox());
        const maxHeight = Math.max(...boundingBoxes.map(b => b.height));
        const maxWidth = Math.max(...boundingBoxes.map(b => b.width));
        tester.remove();

        return {
            maxHeight,
            maxWidth,
            labelCount: labels.length
        };
    };

    const isVertical = () =>
        adaptee.orient() === 'left' || adaptee.orient() === 'right';

    const sign = () => (adaptee.orient() === 'top' || adaptee.orient() === 'left') ? -1 : 1;

    const decorateOffset = sel => {
        const { maxHeight, maxWidth, labelCount } = measureLabels(sel);
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

