import { scaleIdentity } from 'd3-scale';
import { select } from 'd3-selection';
import { dataJoin } from 'd3fc-data-join';
import constant from '../constant';
import ticks from '../ticks';
import { includeMap, prefix, rebindAll } from 'd3fc-rebind';

export default () => {

    let xDecorate = () => {};
    let yDecorate = () => {};

    const xTicks = ticks();
    const yTicks = ticks();
    const containerJoin = dataJoin('g', 'gridline');
    const xJoin = dataJoin('line', 'x');
    const yJoin = dataJoin('line', 'y');

    const instance = (selection) => {

        if (selection.selection) {
            containerJoin.transition(selection);
            xJoin.transition(selection);
            yJoin.transition(selection);
        }

        selection.each((data, index, nodes) => {

            const container = select(nodes[index]);

            const xScale = xTicks.scale();
            const yScale = yTicks.scale();

            const container_ = containerJoin(container, [data])
                .attr('class', 'annotation-gridline')
                .style('stroke', '#bbb');
            const xData = xTicks();
            const xLines = xJoin(container_, xData);

            xLines.attr('x1', xScale)
                .attr('x2', xScale)
                .attr('y1', yScale.range()[0])
                .attr('y2', yScale.range()[1]);

            xDecorate(xLines, xData, index);

            const yData = yTicks();
            const yLines = yJoin(container_, yData);

            yLines.attr('x1', xScale.range()[0])
                .attr('x2', xScale.range()[1])
                .attr('y1', yScale)
                .attr('y2', yScale);

            yDecorate(yLines, yData, index);
        });
    };

    instance.yDecorate = (...args) => {
        if (!args.length) {
            return yDecorate;
        }
        yDecorate = args[0];
        return instance;
    };

    instance.xDecorate = (...args) => {
        if (!args.length) {
            return xDecorate;
        }
        xDecorate = args[0];
        return instance;
    };

    rebindAll(instance, xJoin, includeMap({'key': 'xKey'}));
    rebindAll(instance, yJoin, includeMap({'key': 'yKey'}));

    rebindAll(instance, xTicks, prefix('x'));
    rebindAll(instance, yTicks, prefix('y'));

    return instance;
};
