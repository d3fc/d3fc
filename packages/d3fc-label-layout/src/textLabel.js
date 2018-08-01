import { select } from 'd3-selection';
import functor from './util/functor';
import { dataJoin as dataJoinUtil } from '@d3fc/d3fc-data-join';

export default (layoutStrategy) => {

    let padding = 2;
    let value = (x) => x;

    const textJoin = dataJoinUtil('text');
    const rectJoin = dataJoinUtil('rect');
    const pointJoin = dataJoinUtil('circle');

    const textLabel = (selection) => {
        selection.each((data, index, group) => {

            const node = group[index];
            const nodeSelection = select(node);

            let width = Number(node.getAttribute('layout-width'));
            let height = Number(node.getAttribute('layout-height'));
            let rect = rectJoin(nodeSelection, [data]);
            rect.attr('width', width)
                .attr('height', height);

            let anchorX = Number(node.getAttribute('anchor-x'));
            let anchorY = Number(node.getAttribute('anchor-y'));
            let circle = pointJoin(nodeSelection, [data]);
            circle.attr('r', 2)
                .attr('cx', anchorX)
                .attr('cy', anchorY);

            let text = textJoin(nodeSelection, [data]);
            text.enter()
                .attr('dy', '0.9em')
                .attr('transform', `translate(${padding}, ${padding})`);
            text.text(value);

        });
    };

    textLabel.padding = (...args) => {
        if (!args.length) {
            return padding;
        }
        padding = args[0];
        return textLabel;
    };

    textLabel.value = (...args) => {
        if (!args.length) {
            return value;
        }
        value = functor(args[0]);
        return textLabel;
    };

    return textLabel;
};
