import { scaleIdentity } from 'd3-scale';
import { shapeErrorBar } from 'd3fc-shape';
import { dataJoin } from 'd3fc-data-join';
import { rebind, rebindAll } from 'd3fc-rebind';
import { select } from 'd3-selection';
import errorBarBase from '../errorBarBase';
import colors from '../colors';

export default () => {

    const base = errorBarBase();

    const join = dataJoin('g', 'error-bar');

    const pathGenerator = shapeErrorBar()
        .value(0);

    const errorBar = (selection) => {
        selection.each((data, index, group) => {

            const filteredData = data.filter(base.defined);
            const projectedData = filteredData.map(base.values);
            const g = join(select(group[index]), filteredData);

            g.enter()
                .attr('stroke', colors.black)
                .attr('fill', colors.gray)
                .append('path');

            const width = base.computeBarWidth(filteredData);

            pathGenerator.orient(base.orient())
                .width(width);

            g.each((d, i, g) => {
                const values = projectedData[i];
                pathGenerator.high(values.high)
                    .low(values.low);

                select(g[i])
                    .attr('transform', 'translate(' + values.origin[0] + ',' + values.origin[1] + ')')
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
