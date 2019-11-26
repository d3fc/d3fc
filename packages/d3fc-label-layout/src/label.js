import { select } from 'd3-selection';
import { scaleIdentity } from 'd3-scale';
import functor from './util/functor';
import { dataJoin as dataJoinUtil } from '@d3fc/d3fc-data-join';
import { include, rebindAll } from '@d3fc/d3fc-rebind';

export default (layoutStrategy) => {

    let decorate = () => {};
    let size = () => [0, 0];
    let position = (d, i) => [d.x, d.y];
    let strategy = layoutStrategy || ((x) => x);
    let component = () => {};
    let xScale = scaleIdentity();
    let yScale = scaleIdentity();

    const dataJoin = dataJoinUtil('g', 'label');

    const label = (selection) => {

        selection.each((data, index, group) => {

            const g = dataJoin(select(group[index]), data)
                .call(component);

            // obtain the rectangular bounding boxes for each child
            const nodes = g.nodes();
            const childRects = nodes
                .map((node, i) => {
                    let d = select(node).datum();
                    const pos = position(d, i, nodes);
                    let childPos = [
                        xScale(pos[0]),
                        yScale(pos[1])
                    ];
                    let childSize = size(d, i, nodes);
                    return {
                        hidden: false,
                        x: childPos[0],
                        y: childPos[1],
                        width: childSize[0],
                        height: childSize[1]
                    };
                });

            // apply the strategy to derive the layout. The strategy does not change the order
            // or number of label.
            const layout = strategy(childRects);

            g.attr('style', (_, i) => 'display:' + (layout[i].hidden ? 'none' : 'inherit'))
                .attr('transform', (_, i) => 'translate(' + layout[i].x + ', ' + layout[i].y + ')')
                // set the layout width / height so that children can use SVG layout if required
                .attr('layout-width', (_, i) => layout[i].width)
                .attr('layout-height', (_, i) => layout[i].height)
                .attr('anchor-x', (d, i, g) => childRects[i].x - layout[i].x)
                .attr('anchor-y', (d, i, g) => childRects[i].y - layout[i].y);

            g.call(component);

            decorate(g, data, index);
        });
    };

    rebindAll(label, dataJoin, include('key'));
    rebindAll(label, strategy);

    label.size = (...args) => {
        if (!args.length) {
            return size;
        }
        size = functor(args[0]);
        return label;
    };

    label.position = (...args) => {
        if (!args.length) {
            return position;
        }
        position = functor(args[0]);
        return label;
    };

    label.component = (...args) => {
        if (!args.length) {
            return component;
        }
        component = args[0];
        return label;
    };

    label.decorate = (...args) => {
        if (!args.length) {
            return decorate;
        }
        decorate = args[0];
        return label;
    };

    label.xScale = (...args) => {
        if (!args.length) {
            return xScale;
        }
        xScale = args[0];
        return label;
    };

    label.yScale = (...args) => {
        if (!args.length) {
            return yScale;
        }
        yScale = args[0];
        return label;
    };

    return label;
};
