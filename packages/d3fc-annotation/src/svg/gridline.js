import { select } from 'd3-selection';
import { dataJoin } from '@d3fc/d3fc-data-join';
import ticks from '../ticks';
import { includeMap, prefix, rebindAll } from '@d3fc/d3fc-rebind';

const identity = d => d;

export default () => {

    let xDecorate = () => {};
    let yDecorate = () => {};

    const xTicks = ticks();
    const yTicks = ticks();
    const xJoin = dataJoin('line', 'gridline-y')
      .key(identity);
    const yJoin = dataJoin('line', 'gridline-x')
      .key(identity);

    const instance = (selection) => {

        if (selection.selection) {
            xJoin.transition(selection);
            yJoin.transition(selection);
        }

        selection.each((data, index, nodes) => {

            const element = nodes[index];
            const container = select(nodes[index]);

            const xScale = xTicks.scale();
            const yScale = yTicks.scale();

            // Stash a snapshot of the scale, and retrieve the old snapshot.
            const xScaleOld = element.__x_scale__ || xScale;
            element.__x_scale__ = xScale.copy();

            const xData = xTicks();
            const xLines = xJoin(container, xData);

            xLines.enter()
                .attr('x1', xScaleOld)
                .attr('x2', xScaleOld)
                .attr('y1', yScale.range()[0])
                .attr('y2', yScale.range()[1])
                .attr('stroke', '#bbb');

            xLines
                .attr('x1', xScale)
                .attr('x2', xScale)
                .attr('y1', yScale.range()[0])
                .attr('y2', yScale.range()[1]);

            xLines.exit()
                .attr('x1', xScale)
                .attr('x2', xScale);

            xDecorate(xLines, xData, index);

            // Stash a snapshot of the scale, and retrieve the old snapshot.
            const yScaleOld = element.__y_scale__ || yScale;
            element.__y_scale__ = yScale.copy();

            const yData = yTicks();
            const yLines = yJoin(container, yData);

            yLines.enter()
                .attr('y1', yScaleOld)
                .attr('y2', yScaleOld)
                .attr('x1', xScale.range()[0])
                .attr('x2', xScale.range()[1])
                .attr('stroke', '#bbb');

            yLines
                .attr('y1', yScale)
                .attr('y2', yScale)
                .attr('x1', xScale.range()[0])
                .attr('x2', xScale.range()[1]);

            yLines.exit()
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
