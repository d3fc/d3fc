import { scaleBand } from 'd3-scale';
import { dataJoin } from 'd3fc-data-join';
import { select } from 'd3-selection';
import { rebindAll, exclude } from 'd3fc-rebind';
import groupedBase from '../groupedBase';

export default (series) => {

    const base = groupedBase(series);

    const join = dataJoin('g', 'grouped');

    const grouped = (selection) => {

        if (selection.selection) {
            join.transition(selection);
        }

        selection.each((data, index, group) => {
            base.configureOffsetScale(data);

            const g = join(select(group[index]), data);

            g.enter().append('g');

            g.select('g')
                .each((_, index, group) => {
                    const container = select(group[index]);

                    // create a composite scale that applies the required offset
                    const compositeScale = x => base.xScale()(x) +
                        base.offsetScale()(index) +
                        base.offsetScale().bandwidth() / 2;
                    series.xScale(compositeScale);

                    // adapt the decorate function to give each series the correct index
                    series.decorate((s, d) => base.decorate()(s, d, index));

                    container.call(series);
                });
        });
    };

    rebindAll(grouped, series, exclude('decorate', 'xScale'));
    rebindAll(grouped, base, exclude('configureOffsetScale', 'configureOffset'));

    return grouped;
};
