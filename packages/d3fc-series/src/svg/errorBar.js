import { shapeErrorBar } from '@d3fc/d3fc-shape';
import { dataJoin } from '@d3fc/d3fc-data-join';
import { rebind, rebindAll } from '@d3fc/d3fc-rebind';
import { select } from 'd3-selection';
import errorBarBase from '../errorBarBase';
import colors from '../colors';

export default () => {

    const base = errorBarBase();

    const join = dataJoin('g', 'error-bar');

    const pathGenerator = shapeErrorBar()
        .value(0);

    const propagateTransition = maybeTransition => selection =>
        maybeTransition.selection ? selection.transition(maybeTransition) : selection;

    const containerTranslation =
        (values) => 'translate(' + values.origin[0] + ', ' + values.origin[1] + ')';

    const errorBar = (selection) => {

        if (selection.selection) {
            join.transition(selection);
        }

        const transitionPropagator = propagateTransition(selection);

        selection.each((data, index, group) => {

            const filteredData = data.filter(base.defined());
            const projectedData = filteredData.map(base.values);
            const g = join(select(group[index]), filteredData);

            g.enter()
                .attr('stroke', colors.black)
                .attr('fill', colors.gray)
                .attr('transform', (d, i) => containerTranslation(base.values(d, i)) + ' scale(1e-6, 1)')
                .append('path');

            pathGenerator.orient(base.orient());

            g.each((d, i, g) => {
                const values = projectedData[i];
                pathGenerator.high(values.high)
                    .low(values.low)
                    .width(values.width);

                transitionPropagator(select(g[i]))
                    .attr('transform', containerTranslation(values) + ' scale(1)')
                    .select('path')
                    .attr('d', pathGenerator([d]));
            });

            base.decorate()(g, data, index);
        });
    };

    rebindAll(errorBar, base);
    rebind(errorBar, join, 'key');

    return errorBar;
};
