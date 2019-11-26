import { dataJoin } from '@d3fc/d3fc-data-join';
import ohlcBase from '../ohlcBase';
import { rebind, rebindAll } from '@d3fc/d3fc-rebind';
import { select } from 'd3-selection';
import colors from '../colors';

export default (pathGenerator, seriesName) => {
    const base = ohlcBase();
    const join = dataJoin('g', seriesName);
    const containerTranslation =
        (values) => 'translate(' + values.cross + ', ' + values.high + ')';

    const propagateTransition = maybeTransition => selection =>
        maybeTransition.selection ? selection.transition(maybeTransition) : selection;

    const candlestick = (selection) => {

        if (selection.selection) {
            join.transition(selection);
        }

        const transitionPropagator = propagateTransition(selection);

        selection.each((data, index, group) => {

            const filteredData = data.filter(base.defined());

            const g = join(select(group[index]), filteredData);

            g.enter()
                .attr('transform', (d, i) => containerTranslation(base.values(d, i)) + ' scale(1e-6, 1)')
                .append('path');

            g.each((d, i, g) => {

                const values = base.values(d, i);
                const color = values.direction === 'up' ? colors.green : colors.red;

                const singleCandlestick = transitionPropagator(select(g[i]))
                    .attr('class', seriesName + ' ' + values.direction)
                    .attr('stroke', color)
                    .attr('fill', color)
                    .attr('transform', () => containerTranslation(values) + ' scale(1)');

                pathGenerator.x(0)
                    .width(values.width)
                    .open(() => values.open - values.high)
                    .high(0)
                    .low(() => values.low - values.high)
                    .close(() => values.close - values.high);

                singleCandlestick.select('path')
                    .attr('d', pathGenerator([d]));
            });

            base.decorate()(g, data, index);
        });
    };

    rebind(candlestick, join, 'key');
    rebindAll(candlestick, base);

    return candlestick;
};
