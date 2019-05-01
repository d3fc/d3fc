import { rebindAll, exclude } from '@d3fc/d3fc-rebind';

export default (adaptee) => {

    let labelRotate = 'auto';
    let decorate = () => { };

    const measureLabels = s => {
        const labels = adaptee.scale().domain();

        // Use a test element to measure the text in the axis SVG container
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
        const { labelHeight, maxWidth, measuredSize } = measureLabels(s);

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
            labelHeight,
            maxWidth,
            anchor: rotate ? labelAnchor() : 'middle'
        };
    };

    const decorateRotation = sel => {
        const { rotate, labelHeight, anchor } = calculateRotation(sel);

        const text = sel.select('text');
        const existingTransform = text.attr('transform');

        const offset = sign() * Math.floor(labelHeight / 2);
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

