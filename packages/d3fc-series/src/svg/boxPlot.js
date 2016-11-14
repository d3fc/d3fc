import { scaleIdentity } from 'd3-scale';
import { shapeBoxPlot } from 'd3fc-shape';
import { dataJoin } from 'd3fc-data-join';
import { rebind, rebindAll } from 'd3fc-rebind';
import { select } from 'd3-selection';
import boxPlotBase from '../boxPlotBase';
import colors from '../colors';

export default () => {

    const base = boxPlotBase();

    const join = dataJoin('g', 'box-plot');

    const pathGenerator = shapeBoxPlot()
        .value(0);

    const boxPlot = (selection) => {

        if (selection.selection) {
            join.transition(selection);
        }

        selection.each((data, index, group) => {

            const filteredData = data.filter(base.defined);
            const g = join(select(group[index]), filteredData);

            g.enter()
                .attr('stroke', colors.black)
                .attr('fill', colors.gray)
                .append('path');

            const width = base.computeBarWidth(filteredData);

            pathGenerator.orient(base.orient())
                .width(width);

            g.each((d, i, g) => {
                const values = base.values(d, i);
                pathGenerator.median(values.median)
                    .upperQuartile(values.upperQuartile)
                    .lowerQuartile(values.lowerQuartile)
                    .high(values.high)
                    .low(values.low);

                select(g[i])
                    .attr('transform', 'translate(' + values.origin[0] + ',' + values.origin[1] + ')')
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
