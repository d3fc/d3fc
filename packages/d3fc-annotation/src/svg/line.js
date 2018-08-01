import { scaleIdentity } from 'd3-scale';
import { select } from 'd3-selection';
import { dataJoin } from '@d3fc/d3fc-data-join';
import constant from '../constant';

export default () => {

    let xScale = scaleIdentity();
    let yScale = scaleIdentity();
    let value = d => d;
    let label = value;
    let decorate = () => {};
    let orient = 'horizontal';

    const join = dataJoin('g', 'annotation-line');

    const instance = (selection) => {

        if (selection.selection) {
            join.transition(selection);
        }

        if (orient !== 'horizontal' && orient !== 'vertical') {
            throw new Error('Invalid orientation');
        }
        const horizontal = orient === 'horizontal';
        const translation = horizontal ? (a, b) => `translate(${a}, ${b})` : (a, b) => `translate(${b}, ${a})`;
        const lineProperty = horizontal ? 'x2' : 'y2';
        // the value scale which the annotation 'value' relates to, the crossScale
        // is the other. Which is which depends on the orienation!
        const crossScale = horizontal ? xScale : yScale;
        const valueScale = horizontal ? yScale : xScale;
        const handleOne = horizontal ? 'left-handle' : 'bottom-handle';
        const handleTwo = horizontal ? 'right-handle' : 'top-handle';
        const textOffsetX = horizontal ? '9' : '0';
        const textOffsetY = horizontal ? '0' : '9';
        const textOffsetDeltaY = horizontal ? '0.32em' : '0.71em';
        const textAnchor = horizontal ? 'start' : 'middle';

        const scaleRange = crossScale.range();
        // the transform that sets the 'origin' of the annotation
        const containerTransform = (...args) => translation(scaleRange[0], valueScale(value(...args)));
        const scaleWidth = scaleRange[1] - scaleRange[0];

        selection.each((data, selectionIndex, nodes) => {

            const g = join(select(nodes[selectionIndex]), data);

            // create the outer container and line
            const enter = g.enter()
                .attr('transform', containerTransform)
                .style('stroke', '#bbb');
            enter.append('line')
                .attr(lineProperty, scaleWidth);

            // create containers at each end of the annotation
            enter.append('g')
                .classed(handleOne, true)
                .style('stroke', 'none');

            enter.append('g')
                .classed(handleTwo, true)
                .style('stroke', 'none')
                .attr('transform', translation(scaleWidth, 0))
                .append('text')
                .attr('text-anchor', textAnchor)
                .attr('x', textOffsetX)
                .attr('y', textOffsetY)
                .attr('dy', textOffsetDeltaY);

            // Update
            g.attr('class', `annotation-line ${orient}`);

            // translate the parent container to the left hand edge of the annotation
            g.attr('transform', containerTransform);

            // update the elements that depend on scale width
            g.select('line')
                .attr(lineProperty, scaleWidth);
            g.select('g.' + handleTwo)
                .attr('transform', translation(scaleWidth, 0));

            // Update the text label
            g.select('text')
                .text(label);

            decorate(g, data, selectionIndex);
        });
    };

    instance.xScale = (...args) => {
        if (!args.length) {
            return xScale;
        }
        xScale = args[0];
        return instance;
    };
    instance.yScale = (...args) => {
        if (!args.length) {
            return yScale;
        }
        yScale = args[0];
        return instance;
    };
    instance.value = (...args) => {
        if (!args.length) {
            return value;
        }
        value = constant(args[0]);
        return instance;
    };
    instance.label = (...args) => {
        if (!args.length) {
            return label;
        }
        label = constant(args[0]);
        return instance;
    };
    instance.decorate = (...args) => {
        if (!args.length) {
            return decorate;
        }
        decorate = args[0];
        return instance;
    };
    instance.orient = (...args) => {
        if (!args.length) {
            return orient;
        }
        orient = args[0];
        return instance;
    };

    return instance;
};
