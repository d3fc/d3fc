import { ticksArrayForAxis, tickFormatterForAxis } from './axisTickUtils';

export default (axis) => {
    const measure = selection => {
        const ticks = ticksArrayForAxis(axis);
        const tickFormatter = tickFormatterForAxis(axis);
        const labels = ticks.map(tickFormatter);

        const tester = selection.append('text');
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

    return measure;
};
