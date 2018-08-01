import { scaleIdentity } from 'd3-scale';
import { select } from 'd3-selection';
import { dataJoin } from '@d3fc/d3fc-data-join';
import { shapeBar } from '@d3fc/d3fc-shape';
import constant from '../constant';

export default () => {

    let xScale = scaleIdentity();
    let yScale = scaleIdentity();
    let orient = 'horizontal';
    let fromValue = d => d.from;
    let toValue = d => d.to;
    let decorate = () => {};

    const join = dataJoin('g', 'annotation-band');

    const pathGenerator = shapeBar()
      .horizontalAlign('center')
      .verticalAlign('center')
      .x(0)
      .y(0);

    var instance = (selection) => {

        if (selection.selection) {
            join.transition(selection);
        }

        if (orient !== 'horizontal' && orient !== 'vertical') {
            throw new Error('Invalid orientation');
        }

        const horizontal = orient === 'horizontal';
        const translation = horizontal ? (a, b) => `translate(${a}, ${b})` : (a, b) => `translate(${b}, ${a})`;
        // the value scale which the annotation 'value' relates to, the crossScale
        // is the other. Which is which depends on the orienation!
        const crossScale = horizontal ? xScale : yScale;
        const valueScale = horizontal ? yScale : xScale;
        const crossScaleRange = crossScale.range();
        const crossScaleSize = crossScaleRange[1] - crossScaleRange[0];
        const valueAxisDimension = horizontal ? 'height' : 'width';
        const crossAxisDimension = horizontal ? 'width' : 'height';
        const containerTransform = (...args) => translation(
          (crossScaleRange[1] + crossScaleRange[0]) / 2,
          (valueScale(toValue(...args)) + valueScale(fromValue(...args))) / 2
        );

        pathGenerator[crossAxisDimension](crossScaleSize);
        pathGenerator[valueAxisDimension]((...args) =>
            valueScale(toValue(...args)) - valueScale(fromValue(...args)));

        selection.each((data, index, nodes) => {

            var g = join(select(nodes[index]), data);

            g.enter()
                .attr('transform', containerTransform)
                .append('path')
                .classed('band', true);

            g.attr('class', `annotation-band ${orient}`)
                .attr('transform', containerTransform)
                .select('path')
                // the path generator is being used to render a single path, hence
                // an explicit index is provided
                .attr('d', (d, i) => pathGenerator([d], i));

            decorate(g, data, index);
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
    instance.orient = (...args) => {
        if (!args.length) {
            return orient;
        }
        orient = args[0];
        return instance;
    };
    instance.decorate = (...args) => {
        if (!args.length) {
            return decorate;
        }
        decorate = args[0];
        return instance;
    };
    instance.fromValue = (...args) => {
        if (!args.length) {
            return fromValue;
        }
        fromValue = constant(args[0]);
        return instance;
    };
    instance.toValue = (...args) => {
        if (!args.length) {
            return toValue;
        }
        toValue = constant(args[0]);
        return instance;
    };

    return instance;
};
