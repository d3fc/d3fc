import {dataJoin} from '@d3fc/d3fc-data-join';
import {symbol as symbolShape} from 'd3-shape';
import {select} from 'd3-selection';
import {rebind, exclude, rebindAll} from '@d3fc/d3fc-rebind';
import xyBase from '../xyBase';
import colors from '../colors';

export default () => {
    const symbol = symbolShape();

    const base = xyBase();

    const join = dataJoin('g', 'point');

    const containerTransform = (origin) =>
        'translate(' + origin[0] + ', ' + origin[1] + ')';

    const point = (selection) => {

        if (selection.selection) {
            join.transition(selection);
        }

        selection.each((data, index, group) => {

            const filteredData = data.filter(base.defined());

            const g = join(select(group[index]), filteredData);
            g.enter()
                .attr('transform', (d, i) => containerTransform(base.values(d, i).origin))
                .attr('fill', colors.gray)
                .attr('stroke', colors.black)
                .append('path');

            g.attr('transform', (d, i) => containerTransform(base.values(d, i).origin))
                .select('path')
                .attr('d', symbol);

            base.decorate()(g, data, index);
        });
    };

    rebindAll(point, base, exclude('baseValue', 'bandwidth', 'align'));
    rebind(point, join, 'key');
    rebind(point, symbol, 'type', 'size');

    return point;
};
