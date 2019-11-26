import { dataJoin } from '@d3fc/d3fc-data-join';
import { select } from 'd3-selection';
import { rebindAll } from '@d3fc/d3fc-rebind';
import heatmapBase from '../heatmapBase';

export default () => {

    const base = heatmapBase();

    const join = dataJoin('g', 'box');

    const containerTransform = (values) =>
        'translate(' + values.x +
        ', ' + values.y + ')';

    const heatmap = (selection) => {

        selection.each((data, index, group) => {

            const filteredData = data.filter(base.defined());
            const colorValue = base.colorValue();
            const colorInterpolate = base.colorInterpolate();
            const colorScale = base.colorScale(filteredData);

            const g = join(select(group[index]), filteredData);

            g.enter()
                .append('path')
                .attr('stroke', 'transparent');

            g.attr('transform', (d, i) => containerTransform(base.values(d, i)))
                .select('path')
                .attr('d', (d, i) =>
                    base.pathGenerator.width(base.values(d, i).width)
                      .height(base.values(d, i).height)([d])
                )
                .attr('fill', (d, i) => colorInterpolate(colorScale(colorValue(d, i))));

            base.decorate()(g, data, index);
        });
    };

    rebindAll(heatmap, base);

    return heatmap;
};
