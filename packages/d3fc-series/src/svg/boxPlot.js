import { shapeBoxPlot } from '@d3fc/d3fc-shape';
import { dataJoin } from '@d3fc/d3fc-data-join';
import { rebind, rebindAll } from '@d3fc/d3fc-rebind';
import { select } from 'd3-selection';
import boxPlotBase from '../boxPlotBase';
import colors from '../colors';

export default () => {

    const base = boxPlotBase();

    const join = dataJoin('g', 'box-plot');

    const pathGenerator = shapeBoxPlot()
        .value(0);

    const propagateTransition = maybeTransition => selection =>
        maybeTransition.selection ? selection.transition(maybeTransition) : selection;

    const containerTranslation =
        (values) => 'translate(' + values.origin[0] + ', ' + values.origin[1] + ')';

    const boxPlot = (selection) => {

        if (selection.selection) {
            join.transition(selection);
        }

        const transitionPropagator = propagateTransition(selection);

        selection.each((data, index, group) => {

            const filteredData = data.filter(base.defined());
            const g = join(select(group[index]), filteredData);

            g.enter()
                .attr('stroke', colors.black)
                .attr('fill', colors.gray)
                .attr('transform', (d, i) => containerTranslation(base.values(d, i)) + ' scale(1e-6, 1)')
                .append('path');

            pathGenerator.orient(base.orient());

            g.each((d, i, g) => {
                const values = base.values(d, i);
                pathGenerator.median(values.median)
                    .upperQuartile(values.upperQuartile)
                    .lowerQuartile(values.lowerQuartile)
                    .width(values.width)
                    .high(values.high)
                    .low(values.low);

                transitionPropagator(select(g[i]))
                    .attr('transform', containerTranslation(values))
                    .select('path')
                    .attr('d', pathGenerator([d]));
            });

            base.decorate()(g, data, index);
        });
    };

    rebindAll(boxPlot, base);
    rebind(boxPlot, join, 'key');
    rebind(boxPlot, pathGenerator, 'cap');

    return boxPlot;
};
