import { rebindAll, exclude } from '@d3fc/d3fc-rebind';
import measureLabels from './measureLabels';

export default (adaptee) => {

    let labelRotate = 'auto';
    let decorate = () => { };

    const isVertical = () =>
      adaptee.orient() === 'left' || adaptee.orient() === 'right';
    const sign = () => (adaptee.orient() === 'top' || adaptee.orient() === 'left') ? -1 : 1;

    const labelAnchor = () => {
        switch (adaptee.orient()) {
        case 'top':
        case 'right':
            return 'start';
        default:
            return 'end';
        }
    };

    const calculateRotation = s => {
        const { maxHeight, maxWidth, labelCount } = measureLabels(adaptee)(s);
        const measuredSize = labelCount * maxWidth;

        // The more the overlap, the more we rotate
        let rotate;
        if (labelRotate === 'auto') {
            const range = adaptee.scale().range()[1];
            rotate = range < measuredSize ? 90 * Math.min(1, (measuredSize / range - 0.8) / 2) : 0;
        } else {
            rotate = labelRotate;
        }

        return {
            rotate: isVertical() ? Math.floor(sign() * (90 - rotate)) : Math.floor(-rotate),
            maxHeight,
            maxWidth,
            anchor: rotate ? labelAnchor() : 'middle'
        };
    };

    const decorateRotation = sel => {
        const { rotate, maxHeight, anchor } = calculateRotation(sel);

        const text = sel.select('text');
        const existingTransform = text.attr('transform');

        const offset = sign() * Math.floor(maxHeight / 2);
        const offsetTransform = isVertical() ? `translate(${offset}, 0)` : `translate(0, ${offset})`;

        text.style('text-anchor', anchor)
          .attr('transform', `${existingTransform} ${offsetTransform} rotate(${rotate} 0 0)`);
    };

    const axisLabelRotate = (arg) => {
        adaptee(arg);
    };

    adaptee.decorate(s => {
        decorateRotation(s);
        decorate(s);
    });

    axisLabelRotate.decorate = (...args) => {
        if (!args.length) {
            return decorate;
        }
        decorate = args[0];
        return axisLabelRotate;
    };

    axisLabelRotate.labelRotate = (...args) => {
        if (!args.length) {
            return labelRotate;
        }
        labelRotate = args[0];
        return axisLabelRotate;
    };

    rebindAll(axisLabelRotate, adaptee, exclude('decorate'));

    return axisLabelRotate;
};

