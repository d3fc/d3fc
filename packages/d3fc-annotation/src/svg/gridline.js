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
    const xContainerJoin = dataJoin('g', 'horizontal');
    const yContainerJoin = dataJoin('g', 'vertical');
    const xJoin = dataJoin('line');
    const yJoin = dataJoin('line', 'y');

    const instance = (selection) => {

        selection.each((data, index, nodes) => {

            const container = select(nodes[index]);

            const xScale = xTicks.scale();
            const yScale = yTicks.scale();

            const xContainer = xContainerJoin(container, [xData])
                .classed('annotation-gridline', true)
                .style('stroke', '#bbb');
            const xData = xTicks();
            const xLines = xJoin(xContainer, xData);

            xLines.attr('x1', xScale)
                .attr('x2', xScale)
                .attr('y1', yScale.range()[0])
                .attr('y2', yScale.range()[1]);

            xDecorate(xLines, xData, index);

            const yContainer = yContainerJoin(container, [xData])
                .classed('annotation-gridline', true)
                .style('stroke', '#bbb');
            const yData = yTicks();
            const yLines = yJoin(yContainer, yData);

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
